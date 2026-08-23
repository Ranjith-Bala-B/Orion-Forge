import { CMSData } from '../types/cms';
import { supabase } from '../config/supabase';

const CMS_STORAGE_KEY = 'orion_cms_data';

export const cmsService = {
  getCMSData: async (): Promise<CMSData> => {
    try {
      const [
        { data: siteConfig },
        { data: teamMembers },
        { data: projects },
        { data: achievements },
        { data: stats },
        { data: timeline }
      ] = await Promise.all([
        supabase.from('site_config').select('*').eq('id', 1).single(),
        supabase.from('team_members').select('*'),
        supabase.from('projects').select('*'),
        supabase.from('achievements').select('*'),
        supabase.from('stats').select('*'),
        supabase.from('timeline').select('*')
      ]);

      if (!siteConfig || !teamMembers || !projects || !achievements || !stats || !timeline) {
        throw new Error('Incomplete data received from Supabase');
      }

      const ordering = siteConfig.about?.ordering || {};
      
      const sortByIds = (items: any[], ids: string[]) => {
        if (!ids || ids.length === 0) return items;
        return [...items].sort((a, b) => {
          const idxA = ids.indexOf(a.id);
          const idxB = ids.indexOf(b.id);
          if (idxA === -1 && idxB === -1) return 0;
          if (idxA === -1) return 1;
          if (idxB === -1) return -1;
          return idxA - idxB;
        });
      };

      return {
        site: {
          name: siteConfig.name,
          tagline: siteConfig.tagline,
          description: siteConfig.description,
          email: siteConfig.email,
          year: siteConfig.year,
          socials: siteConfig.socials,
          about: siteConfig.about,
          hero: siteConfig.hero
        },
        team: sortByIds(teamMembers, ordering.team).map((m: any) => ({
          id: m.id,
          name: m.name,
          role: m.role,
          avatar: m.avatar_url,
          bio: m.bio,
          detailedAbout: m.detailed_about,
          skills: m.skills,
          experience: m.experience,
          projects: m.projects,
          email: m.email,
          phone: m.phone,
          socials: m.socials,
          cvUrl: m.cv_url
        })),
        projects: sortByIds(projects, ordering.projects).map((p: any) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          shortDescription: p.short_description,
          problemStatement: p.problem_statement,
          solution: p.solution,
          features: p.features,
          techStack: p.tech_stack,
          architectureDiagram: p.architecture_diagram_url,
          resultsImpact: p.results_impact,
          thumbnail: p.thumbnail_url,
          coverImage: p.cover_image_url,
          gallery: p.gallery,
          links: p.links
        })),
        achievements: sortByIds(achievements, ordering.achievements).map((a: any) => ({
          id: a.id,
          title: a.title,
          event: a.event,
          date: a.date,
          badge: a.badge,
          description: a.description,
          fullDescription: a.full_description,
          image: a.image_url,
          certificatePreview: a.certificate_preview_url,
          certificateDownloadUrl: a.certificate_download_url,
          gallery: a.gallery,
          teamMembers: a.team_members
        })),
        stats: sortByIds(stats, ordering.stats).map((s: any) => ({
          id: s.id,
          label: s.label,
          value: s.value,
          suffix: s.suffix,
          description: s.description,
          iconName: s.icon_name
        })),
        timeline: sortByIds(timeline, ordering.timeline).map((t: any) => ({
          id: t.id,
          year: t.year,
          title: t.title,
          subtitle: t.subtitle,
          description: t.description,
          tag: t.tag,
          highlight: t.highlight
        }))
      };
    } catch (error) {
      console.error("Error fetching CMS Data from Supabase:", error);
      // Removed local storage fallback to ensure Supabase is the true source of truth
      // If the data is empty or fails, we throw the error and let the UI handle the failure state.
      throw error;
    }
  },

  // Helper to upload a base64 or file object to Supabase Storage
  uploadFile: async (fileData: string, path: string): Promise<string> => {
    if (!fileData.startsWith('data:')) return fileData; // Already a URL
    
    try {
      const response = await fetch(fileData);
      const blob = await response.blob();
      const fileExt = blob.type.split('/')[1] || 'png';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${path}/${fileName}`;

      const { error } = await supabase.storage
        .from('orion_forge_assets')
        .upload(filePath, blob, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data } = supabase.storage
        .from('orion_forge_assets')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (e) {
      console.error("File upload failed:", e);
      return fileData; // Fallback to base64 if upload fails
    }
  },

  saveCMSData: async (data: CMSData): Promise<void> => {
    try {
      // 1. Process all file uploads first (convert base64 to public URLs)
      
      // Upload Site Images
      if (data.site.about.image.startsWith('data:')) {
        data.site.about.image = await cmsService.uploadFile(data.site.about.image, 'site');
      }
      if (data.site.hero.coreGraphicImage?.startsWith('data:')) {
        data.site.hero.coreGraphicImage = await cmsService.uploadFile(data.site.hero.coreGraphicImage, 'site');
      }

      // Upload Team Images & Resumes
      for (const member of data.team) {
        if (member.avatar.startsWith('data:')) {
          member.avatar = await cmsService.uploadFile(member.avatar, 'team_avatars');
        }
        if (member.cvUrl?.startsWith('data:')) {
          member.cvUrl = await cmsService.uploadFile(member.cvUrl, 'resumes');
        }
      }

      // Upload Project Images
      for (const project of data.projects) {
        if (project.thumbnail.startsWith('data:')) project.thumbnail = await cmsService.uploadFile(project.thumbnail, 'project_images');
        if (project.coverImage.startsWith('data:')) project.coverImage = await cmsService.uploadFile(project.coverImage, 'project_images');
        if (project.architectureDiagram?.startsWith('data:')) project.architectureDiagram = await cmsService.uploadFile(project.architectureDiagram, 'project_images');
        
        for (let i = 0; i < project.gallery.length; i++) {
          if (project.gallery[i].startsWith('data:')) {
            project.gallery[i] = await cmsService.uploadFile(project.gallery[i], 'project_images');
          }
        }
      }

      // Upload Achievement Images
      for (const achievement of data.achievements) {
        if (achievement.image.startsWith('data:')) achievement.image = await cmsService.uploadFile(achievement.image, 'achievement_certificates');
        if (achievement.certificatePreview?.startsWith('data:')) achievement.certificatePreview = await cmsService.uploadFile(achievement.certificatePreview, 'achievement_certificates');
        
        for (let i = 0; i < achievement.gallery.length; i++) {
          if (achievement.gallery[i].startsWith('data:')) {
            achievement.gallery[i] = await cmsService.uploadFile(achievement.gallery[i], 'achievement_certificates');
          }
        }
      }

      // 2. Sync Deletions (Remove items that were deleted in the CMS)
      const syncTableDeletions = async (tableName: string, currentItems: any[]) => {
        const { data: existingRecords, error } = await supabase.from(tableName).select('id');
        if (error) throw error;
        if (existingRecords) {
          const currentIds = currentItems.map(item => item.id);
          const idsToDelete = existingRecords.map((r: any) => r.id).filter((id: string) => !currentIds.includes(id));
          if (idsToDelete.length > 0) {
            const { error: delError } = await supabase.from(tableName).delete().in('id', idsToDelete);
            if (delError) throw delError;
          }
        }
      };

      await Promise.all([
        syncTableDeletions('team_members', data.team),
        syncTableDeletions('projects', data.projects),
        syncTableDeletions('achievements', data.achievements),
        syncTableDeletions('stats', data.stats),
        syncTableDeletions('timeline', data.timeline)
      ]);

      // 3. Save Data to Supabase
      
      await supabase.from('site_config').upsert({
        id: 1,
        name: data.site.name,
        tagline: data.site.tagline,
        description: data.site.description,
        email: data.site.email,
        year: data.site.year,
        socials: data.site.socials,
        about: {
          ...data.site.about,
          ordering: {
            team: data.team.map(t => t.id),
            projects: data.projects.map(p => p.id),
            achievements: data.achievements.map(a => a.id),
            stats: data.stats.map(s => s.id),
            timeline: data.timeline.map(t => t.id)
          }
        },
        hero: data.site.hero
      });

      for (const member of data.team) {
        const { error: e2 } = await supabase.from('team_members').upsert({
          id: member.id, name: member.name, role: member.role, avatar_url: member.avatar,
          bio: member.bio, detailed_about: member.detailedAbout, email: member.email,
          phone: member.phone, socials: member.socials, skills: member.skills,
          experience: member.experience, projects: member.projects, cv_url: member.cvUrl
        });
        if (e2) throw e2;
      }

      for (const project of data.projects) {
        const { error: e3 } = await supabase.from('projects').upsert({
          id: project.id, name: project.name, category: project.category, short_description: project.shortDescription,
          problem_statement: project.problemStatement, solution: project.solution, features: project.features,
          tech_stack: project.techStack, architecture_diagram_url: project.architectureDiagram, results_impact: project.resultsImpact,
          thumbnail_url: project.thumbnail, cover_image_url: project.coverImage, gallery: project.gallery, links: project.links
        });
        if (e3) throw e3;
      }

      for (const achievement of data.achievements) {
        const { error: e4 } = await supabase.from('achievements').upsert({
          id: achievement.id, title: achievement.title, event: achievement.event, date: achievement.date,
          badge: achievement.badge, description: achievement.description, full_description: achievement.fullDescription,
          image_url: achievement.image, certificate_preview_url: achievement.certificatePreview,
          certificate_download_url: achievement.certificateDownloadUrl, gallery: achievement.gallery, team_members: achievement.teamMembers
        });
        if (e4) throw e4;
      }

      for (const stat of data.stats) {
        const { error: e5 } = await supabase.from('stats').upsert({
          id: stat.id, label: stat.label, value: stat.value.toString(), suffix: stat.suffix,
          description: stat.description, icon_name: stat.iconName
        });
        if (e5) throw e5;
      }

      for (const item of data.timeline) {
        const { error: e6 } = await supabase.from('timeline').upsert({
          id: item.id, year: item.year, title: item.title, subtitle: item.subtitle,
          description: item.description, tag: item.tag, highlight: item.highlight
        });
        if (e6) throw e6;
      }

      // Also keep a local backup just in case
      localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(data));
      window.dispatchEvent(new Event('cms_updated'));
      
    } catch (error) {
      console.error("Error saving CMS Data to Supabase:", error);
      throw error;
    }
  },

  resetCMSToDefaults: async (): Promise<void> => {
    // Usually we don't wipe the DB from the frontend, but we can clear local storage
    localStorage.removeItem(CMS_STORAGE_KEY);
    window.dispatchEvent(new Event('cms_updated'));
  },
};
