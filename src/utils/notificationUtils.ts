import {
  NotificationLink,
  NotificationType,
} from '@/containers/Notifications/index.types';

export const interpolateTemplate = (
  type: NotificationType,
  links: NotificationLink[],
): string => {
  const template = getNotificationTemplate(type);

  let result = template;

  let schoolLinkLength = links.filter(
    (link) => link.entityType === 'school',
  ).length;
  let placeholder = '';

  links.forEach((link) => {
    switch (link.entityType) {
      case 'school':
        placeholder = '${school}';
        break;

      case 'report':
        placeholder = '${report}';
        break;

      case 'comment':
        placeholder = '${comment}';
        break;

      case 'application':
        placeholder = '${application}';
        break;

      case 'agency':
        placeholder = '${agency}';
        break;

      case 'complaint':
        placeholder = '${complaint}';
        break;

      case 'user':
        placeholder = '${user}';
        break;

      default:
        placeholder = '';
        break;
    }

    // Replace the placeholder with the link
    result = result.replace(
      placeholder,
      `<span class="body1-bold cursor-pointer hover:text-orange-500" data-entity-type="${link.entityType}" data-entity-id="${link.id}">${link.label}</span>`,
    );

    // If there are multiple schools, add a comma and placeholder for the next school
    if (schoolLinkLength > 1) {
      result += ', ${school}';
      schoolLinkLength--;
    }
  });
  return `<span class="body1-regular">${result}</span>`;
};

export const getActionButtonText = (type: NotificationType): string => {
  switch (type) {
    case NotificationType.ReportAssignment:
      return 'View reports';
    case NotificationType.Comment:
      return 'View comment';
    case NotificationType.ReportSubmission:
      return 'View report';
    default:
      return 'View';
  }
};

export const getActionButtonLink = (
  type: NotificationType,
  links: NotificationLink[],
): string | null => {
  switch (type) {
    case NotificationType.ReportAssignment:
      return links.find((link) => link.entityType === 'school')?.id || null;
    case NotificationType.Comment:
      return links.find((link) => link.entityType === 'comment')?.id || null;
    case NotificationType.ReportSubmission:
      return links.find((link) => link.entityType === 'report')?.id || null;
    default:
      return null;
  }
};

export const getNotificationTemplate = (type: NotificationType) => {
  switch (type) {
    // Report Assignments
    case NotificationType.ReportAssignment:
      return 'You have been assigned to ${report} for ${school}';

    case NotificationType.MultipleReportAssignment:
      return 'You have been assigned to ${report} for ${school}';

    case NotificationType.ReportUnassignment:
      return 'You have been unassigned from ${report} for ${school}';

    case NotificationType.MultipleReportUnassignment:
      return 'You have been unassigned from ${report} for ${school}';

    // Comments
    case NotificationType.NewComments:
      return 'You have new comments on ${report}';

    // Report Submissions
    case NotificationType.ReportSubmission:
      return '${school} has submitted ${report}';

    // School and Networks
    case NotificationType.NewSchoolUsers:
      return '${user} has been added to ${school}';

    case NotificationType.SchoolInfoUpdate:
      return '${school} has edited their school information';

    case NotificationType.BoardCalendarUpdate:
      return '${school} has a board calendar update';

    // Applications
    case NotificationType.ApplicationSubmission:
      return '${school} has submitted ${application}';
    case NotificationType.ApplicationEvaluation:
      return 'You have a new submission of ${application} by ${school} to evaluate';

    // Complaints
    case NotificationType.ComplaintAssignment:
      return 'You have been assigned to review ${complaint}';

    // Agency Users
    case NotificationType.NewAgencyUser:
      return '${user} has joined Reportwell. Send them a message to welcome them to the team!';

    default:
      return '';
  }
};
