export interface CanvasUser {
  id: number;
  name: string;
  short_name?: string;
  sortable_name: string;
  email?: string;
  avatar_url?: string;
  locale?: string;
  effective_locale?: string;
  created_at: string;
  permissions?: Record<string, boolean>;
}

export interface CanvasCourse {
  id: number;
  name: string;
  course_code: string;
  account_id: number;
  uuid: string;
  start_at?: string;
  end_at?: string;
  enrollments?: CanvasEnrollment[];
  calendar?: {
    ics: string;
  };
  workflow_state: 'unpublished' | 'available' | 'completed' | 'deleted';
  created_at: string;
  default_view?: 'feed' | 'wiki' | 'modules' | 'syllabus' | 'assignments';
  public_description?: string;
  is_public?: boolean;
  is_public_to_auth_users?: boolean;
  restrict_enrollments_to_course_dates?: boolean;
}

export interface CanvasEnrollment {
  type: 'StudentEnrollment' | 'TeacherEnrollment' | 'TaEnrollment' | 'DesignerEnrollment' | 'ObserverEnrollment';
  role: string;
  role_id: number;
  user_id: number;
  enrollment_state: 'active' | 'invited' | 'inactive' | 'completed';
  limit_privileges_to_course_section: boolean;
}

export interface CanvasAssignment {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  due_at?: string;
  lock_at?: string;
  unlock_at?: string;
  has_overrides?: boolean;
  course_id: number;
  html_url: string;
  submissions_download_url?: string;
  assignment_group_id: number;
  due_date_required: boolean;
  allowed_extensions?: string[];
  max_name_length?: number;
  turnitin_enabled?: boolean;
  turnitin_settings?: Record<string, any>;
  vericite_enabled?: boolean;
  grade_group_students_individually?: boolean;
  external_tool_tag_attributes?: Record<string, any>;
  peer_reviews?: boolean;
  automatic_peer_reviews?: boolean;
  peer_review_count?: number;
  peer_reviews_assign_at?: string;
  intra_group_peer_reviews?: boolean;
  anonymous_peer_reviews?: boolean;
  discussion_topic?: CanvasDiscussionTopic;
  submission_types: SubmissionType[];
  has_submitted_submissions?: boolean;
  grading_type: GradingType;
  grading_standard_id?: number;
  points_possible: number;
  position: number;
  post_to_sis?: boolean;
  integration_id?: string;
  integration_data?: Record<string, any>;
  published: boolean;
  unpublishable?: boolean;
  only_visible_to_overrides?: boolean;
  locked_for_user?: boolean;
  lock_info?: Record<string, any>;
  lock_explanation?: string;
  quiz_id?: number;
  anonymous_submissions?: boolean;
  workflow_state: 'published' | 'unpublished' | 'deleted';
  muted?: boolean;
  omit_from_final_grade?: boolean;
  moderated_grading?: boolean;
  grader_count?: number;
  final_grader_id?: number;
  grader_comments_visible_to_graders?: boolean;
  graders_anonymous_to_graders?: boolean;
  grader_names_visible_to_final_grader?: boolean;
  anonymous_grading?: boolean;
  allowed_attempts?: number;
  secure_params?: string;
  course_id_path?: number[];
}

export type SubmissionType = 
  | 'online_text_entry'
  | 'online_url'
  | 'online_upload'
  | 'media_recording'
  | 'student_annotation'
  | 'basic_lti_launch'
  | 'not_graded'
  | 'on_paper'
  | 'none'
  | 'external_tool';

export type GradingType = 
  | 'pass_fail'
  | 'percent'
  | 'letter_grade'
  | 'gpa_scale'
  | 'points'
  | 'not_graded';

export interface CanvasSubmission {
  id: number;
  body?: string;
  url?: string;
  submitted_at?: string;
  assignment_id: number;
  user_id: number;
  submission_type?: SubmissionType;
  workflow_state: 'submitted' | 'unsubmitted' | 'graded' | 'pending_review';
  grade?: string;
  score?: number;
  excused?: boolean;
  late?: boolean;
  missing?: boolean;
  late_policy_status?: string;
  points_deducted?: number;
  seconds_late?: number;
  posted_at?: string;
  preview_url?: string;
  attachments?: CanvasFile[];
}

export interface CanvasFile {
  id: number;
  uuid: string;
  folder_id: number;
  display_name: string;
  filename: string;
  content_type: string;
  url: string;
  size: number;
  created_at: string;
  updated_at: string;
  unlock_at?: string;
  locked?: boolean;
  hidden?: boolean;
  lock_at?: string;
  hidden_for_user?: boolean;
  thumbnail_url?: string;
  modified_at: string;
  mime_class: string;
  media_entry_id?: string;
}

export interface CanvasDiscussionTopic {
  id: number;
  title: string;
  message?: string;
  html_url: string;
  posted_at: string;
  last_reply_at?: string;
  discussion_subentry_count: number;
  read_state: 'read' | 'unread';
  unread_count: number;
  subscribed: boolean;
  user_can_see_posts?: boolean;
  published: boolean;
  can_unpublish?: boolean;
  locked: boolean;
  can_lock?: boolean;
  user_name?: string;
  topic_children?: number[];
  attachments?: CanvasFile[];
  unauthorized?: boolean;
  discussion_type?: 'side_comment' | 'threaded';
  group_category_id?: number;
  can_group?: boolean;
  context_code?: string;
}

export interface CanvasCalendarEvent {
  id: number;
  title: string;
  start_at: string;
  end_at?: string;
  workflow_state: 'active' | 'locked' | 'deleted';
  created_at: string;
  updated_at: string;
  all_day: boolean;
  all_day_date?: string;
  comments?: string;
  location_address?: string;
  location_name?: string;
  type?: 'event' | 'assignment';
  description?: string;
  child_events?: CanvasCalendarEvent[];
  assignment?: CanvasAssignment;
  url?: string;
  html_url: string;
  context_code: string;
  effective_context_code?: string;
  hidden?: boolean;
  parent_event_id?: number;
  appointment_group_id?: number;
  appointment_group_url?: string;
  participant_type?: 'User' | 'Group';
}

export interface CanvasDashboardCard {
  id: number;
  isFavorited: boolean;
  image: string;
  image_url: string;
  color?: string;
  position?: number;
  assetString: string;
  href: string;
  links: {
    self: string;
    users: string;
    groups: string;
    calendar: string;
    discussion_topics: string;
    assignments: string;
    quizzes: string;
    modules: string;
    files: string;
    pages: string;
    conferences: string;
    announcements: string;
  };
  longName: string;
  originalName: string;
  shortName: string;
  term?: string;
  subtitle?: string;
  enrollmentType?: string;
  observee?: string;
  courseCode: string;
  canChangeCoursePublishState?: boolean;
  defaultView?: string;
  pagesUrl?: string;
  frontPageTitle?: string;
  isK5Subject?: boolean;
  isHomeroom?: boolean;
  useClassicFont?: boolean;
  canManage?: boolean;
  canReadAnnouncements?: boolean;
  published?: boolean;
}

export interface CanvasModule {
  id: number;
  workflow_state: 'active' | 'deleted';
  position: number;
  name: string;
  unlock_at?: string;
  require_sequential_progress?: boolean;
  prerequisite_module_ids?: number[];
  items_count: number;
  items_url: string;
  items?: CanvasModuleItem[];
  state?: 'locked' | 'unlocked' | 'started' | 'completed';
  completed_at?: string;
  publish_final_grade?: boolean;
  published?: boolean;
}

export interface CanvasModuleItem {
  id: number;
  module_id: number;
  position: number;
  title: string;
  indent: number;
  type: 'File' | 'Page' | 'Discussion' | 'Assignment' | 'Quiz' | 'SubHeader' | 'ExternalUrl' | 'ExternalTool';
  content_id?: number;
  html_url?: string;
  url?: string;
  page_url?: string;
  external_url?: string;
  new_tab?: boolean;
  completion_requirement?: {
    type: 'must_view' | 'must_submit' | 'must_contribute' | 'min_score' | 'must_mark_done';
    min_score?: number;
    completed?: boolean;
  };
  content_details?: {
    points_possible?: number;
    due_at?: string;
    unlock_at?: string;
    lock_at?: string;
  };
  published?: boolean;
}

export interface CanvasGrade {
  html_url: string;
  current_grade?: string;
  final_grade?: string;
  current_score?: number;
  final_score?: number;
  total_points_possible?: number;
  current_points?: number;
  unposted_current_grade?: string;
  unposted_final_grade?: string;
  unposted_current_score?: number;
  unposted_final_score?: number;
  unposted_current_points?: number;
  has_grading_scheme?: boolean;
  totals_for_all_grading_periods_option?: boolean;
  current_grading_period_title?: string;
  current_grading_period_id?: number;
  current_period_computed_current_score?: number;
  current_period_computed_final_score?: number;
  current_period_computed_current_grade?: string;
  current_period_computed_final_grade?: string;
  current_period_unposted_current_score?: number;
  current_period_unposted_final_score?: number;
  current_period_unposted_current_grade?: string;
  current_period_unposted_final_grade?: string;
}

export interface CanvasAnnouncement {
  id: number;
  title: string;
  message: string;
  author: {
    id: number;
    name: string;
    avatar_image_url?: string;
    html_url: string;
  };
  read_state: 'read' | 'unread';
  created_at: string;
  posted_at: string;
  delayed_post_at?: string;
  last_reply_at?: string;
  require_initial_post?: boolean;
  user_can_see_posts?: boolean;
  discussion_subentry_count: number;
  permissions?: {
    attach?: boolean;
    update?: boolean;
    reply?: boolean;
    delete?: boolean;
  };
  is_announcement: true;
  locked: boolean;
  pinned?: boolean;
  position?: number;
  context_code: string;
  attachments?: CanvasFile[];
}