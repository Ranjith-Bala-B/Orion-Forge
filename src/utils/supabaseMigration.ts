import { supabase } from '../config/supabase';
import { siteConfig } from '../data/site';
import { teamMembers } from '../data/team';
import { projectsData } from '../data/projects';
import { achievementsData } from '../data/achievements';
import { statsData } from '../data/stats';
import { timelineData } from '../data/timeline';
import { initialHackathons, initialHistoryEntries } from '../data/vaultInitialData';

export const migrateToSupabase = async () => {
  console.log("Starting migration to Supabase...");
  const data = {
    site: siteConfig,
    team: teamMembers,
    projects: projectsData,
    achievements: achievementsData,
    stats: statsData,
    timeline: timelineData,
  };

  try {
    // 1. Site Config
    console.log("Migrating Site Config...");
    const { error: siteErr } = await supabase.from('site_config').upsert({
      id: 1,
      name: data.site.name,
      tagline: data.site.tagline,
      description: data.site.description,
      email: data.site.email,
      year: data.site.year,
      socials: data.site.socials,
      about: data.site.about,
      hero: data.site.hero,
    });
    if (siteErr) throw siteErr;

    // 2. Team Members
    console.log("Migrating Team Members...");
    for (const member of data.team) {
      const { error } = await supabase.from('team_members').upsert({
        id: member.id,
        name: member.name,
        role: member.role,
        avatar_url: member.avatar,
        bio: member.bio,
        detailed_about: member.detailedAbout,
        email: member.email,
        phone: member.phone,
        socials: member.socials,
        skills: member.skills,
        experience: member.experience,
        projects: member.projects,
        cv_url: member.cvUrl,
      });
      if (error) throw error;
    }

    // 3. Projects
    console.log("Migrating Projects...");
    for (const project of data.projects) {
      const { error } = await supabase.from('projects').upsert({
        id: project.id,
        name: project.name,
        category: project.category,
        short_description: project.shortDescription,
        problem_statement: project.problemStatement,
        solution: project.solution,
        features: project.features,
        tech_stack: project.techStack,
        architecture_diagram_url: project.architectureDiagram,
        results_impact: project.resultsImpact,
        thumbnail_url: project.thumbnail,
        cover_image_url: project.coverImage,
        gallery: project.gallery,
        links: project.links,
      });
      if (error) throw error;
    }

    // 4. Achievements
    console.log("Migrating Achievements...");
    for (const achievement of data.achievements) {
      const { error } = await supabase.from('achievements').upsert({
        id: achievement.id,
        title: achievement.title,
        event: achievement.event,
        date: achievement.date,
        badge: achievement.badge,
        description: achievement.description,
        full_description: achievement.fullDescription,
        image_url: achievement.image,
        certificate_preview_url: achievement.certificatePreview,
        certificate_download_url: achievement.certificateDownloadUrl,
        gallery: achievement.gallery,
        team_members: achievement.teamMembers,
      });
      if (error) throw error;
    }

    // 5. Stats
    console.log("Migrating Stats...");
    for (const stat of data.stats) {
      const { error } = await supabase.from('stats').upsert({
        id: stat.id,
        label: stat.label,
        value: stat.value.toString(),
        suffix: stat.suffix,
        description: stat.description,
        icon_name: stat.iconName,
      });
      if (error) throw error;
    }

    // 6. Timeline
    console.log("Migrating Timeline...");
    for (const item of data.timeline) {
      const { error } = await supabase.from('timeline').upsert({
        id: item.id,
        year: item.year,
        title: item.title,
        subtitle: item.subtitle,
        description: item.description,
        tag: item.tag,
        highlight: item.highlight,
      });
      if (error) throw error;
    }

    // 7. Vault History
    console.log("Migrating Vault History...");
    for (const entry of initialHistoryEntries) {
      const { error } = await supabase.from('history_entries').upsert({
        id: entry.id,
        hackathon_id: entry.hackathonId,
        hackathon_name: entry.hackathonName,
        project_name: entry.projectName,
        organizer: entry.organizer,
        date: entry.date,
        rounds_count: entry.roundsCount,
        result: entry.result,
        result_details: entry.resultDetails,
        description: entry.description,
        problem_statement: entry.problemStatement,
        github_url: entry.githubUrl,
        demo_url: entry.demoUrl,
        video_url: entry.videoUrl,
        certificate_url: entry.certificateUrl,
        ppt_url: entry.pptUrl,
        overview: entry.overview,
        team_members: entry.teamMembers,
        gallery: entry.gallery,
        round_results: entry.roundResults || null,
        project_links: entry.projectLinks || null,
        hackathon_links: entry.hackathonLinks || null,
        certificates: entry.certificates || null,
        documents: entry.documents || null,
        rounds: entry.rounds || null,
      });
      if (error) throw error;
    }

    // 8. Vault Active Hackathons
    console.log("Migrating Vault Hackathons...");
    for (const hackathon of initialHackathons) {
      const { error: hError } = await supabase.from('hackathons').upsert({
        id: hackathon.id,
        name: hackathon.name,
        type: hackathon.type,
        organizer: hackathon.organizer,
        mode: hackathon.mode,
        website_url: hackathon.websiteUrl,
        registration_url: hackathon.registrationUrl,
        problem_statement: hackathon.problemStatement,
        description: hackathon.description,
        status: hackathon.status,
        created_at: hackathon.createdAt,
        is_game_over: hackathon.isGameOver,
      });
      if (hError) throw hError;

      for (const round of hackathon.rounds) {
        await supabase.from('hackathon_rounds').upsert({
          id: round.id, hackathon_id: hackathon.id, name: round.name, type: round.type, mode: round.mode,
          start_date: round.startDate, start_time: round.startTime, deadline_date: round.deadlineDate, deadline_time: round.deadlineTime,
          submission_details: round.submissionDetails, submission_requirements: round.submissionRequirements, result_date: round.resultDate,
          status: round.status, remarks: round.remarks, completed: round.completed,
        });
      }
      for (const task of hackathon.tasks) {
        await supabase.from('hackathon_tasks').upsert({
          id: task.id, hackathon_id: hackathon.id, title: task.title, priority: task.priority,
          assigned_member: task.assignedMember, due_date: task.dueDate, completed: task.completed,
        });
      }
      for (const doc of hackathon.documents) {
        await supabase.from('hackathon_documents').upsert({
          id: doc.id, hackathon_id: hackathon.id, name: doc.name, type: doc.type, url: doc.url,
          size: doc.size, uploaded_at: doc.uploadedAt, category: doc.category,
        });
      }
      for (const link of hackathon.links) {
        await supabase.from('hackathon_links').upsert({
          id: link.id, hackathon_id: hackathon.id, title: link.title, url: link.url, type: link.type,
        });
      }
      for (const member of hackathon.team) {
        await supabase.from('hackathon_team').upsert({
          id: member.id, hackathon_id: hackathon.id, member_name: member.memberName, role: member.role, responsibility: member.responsibility,
        });
      }
      for (const note of hackathon.notes) {
        await supabase.from('hackathon_notes').upsert({
          id: note.id, hackathon_id: hackathon.id, title: note.title, content: note.content, updated_at: note.updatedAt,
        });
      }
    }

    console.log("Migration completed successfully!");
    return true;
  } catch (error) {
    console.error("Migration failed:", error);
    return false;
  }
};
