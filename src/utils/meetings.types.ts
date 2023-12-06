// ATTENDEE TYPES:

export enum MeetingStatus {
  NO_COMPATIBLE_DATES = "No compatible dates",
  ACTION_NEEDED = "Action needed",
  MEETING_CONFIRMED = "Meeting confirmed",
  WAITING_RESPONSE = "Waiting for responses",
}

export enum AttendeeStatus {
  PENDING_RESPONSE = "Pending",
  RESPONDED = "Responded",
  UNAVAILABLE = "Unavailable",
}

export enum DateResponseStatus {
  YES = "Yes",
  NO = "No",
  NO_RESPONSE = "Not Responded",
}

export type DateResponse = {
  startDate: string;
  endDate: string;
  status: DateResponseStatus;
};

export type AttendeeType = {
  //   id?: number;
  name: string;
  email: string;
  roleInformation?: string;
  role: string;
  attendeeStatus: AttendeeStatus;
  dateResponse: DateResponse[];
};

export type MeetingStatuses = {
  [status in DateResponseStatus]: string[];
};

export type MeetingDate = {
  endTime: string;
} & MeetingStatuses;

export type MeetingDateTimeTypes = {
  [key: string]: MeetingDate;
};

type MeetingInformation = {
  meetingTitle: string;
  meetingStatus: MeetingStatus;
  samProgress: SamProgress;
  attendees: AttendeeType[];
  numOfCompatibleDates: number;
  numOfDates: number;
  confirmedDate?: string;
  meetingTimes?: MeetingDateTimeTypes;
};

export type Meeting = {
  [meetingId: string]: MeetingInformation;
};

export enum SamProgress {
  SEND_EMAIL = "Send Emails",
  PENDING_CONFIRMATION = "Pending Confirmation",
  FINISH = "Finish",
}
