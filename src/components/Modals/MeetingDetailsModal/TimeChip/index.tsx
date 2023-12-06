import {
  AttendeeType,
  DateResponseStatus,
  MeetingDateTimeTypes,
  MeetingStatus,
} from "@/utils/meetings.types";
import { Tooltip, useDisclosure } from "@nextui-org/react";
import clsx from "clsx";
import moment from "moment";
import ConfirmMeeting from "../../ConfirmMeeting";

interface TimeChipProps {
  meetingDateTime: MeetingDateTimeTypes;
  numOfAttendees: number;
  meetingId: string;
  attendees: AttendeeType[];
  title: string;
  meetingStatus: MeetingStatus;
  confirmedDateTime?: string;
  mutateInvitations: () => void;
}

const TimeChip: React.FC<TimeChipProps> = ({
  meetingDateTime,
  numOfAttendees,
  meetingId,
  attendees,
  title,
  meetingStatus,
  confirmedDateTime,
  mutateInvitations,
}) => {
  const meetingTime = Object.keys(meetingDateTime)[0];
  const formatDateTime = moment(meetingTime).format("DD MMM YYYY, ddd, h:mm A");
  const yesNames = meetingDateTime[meetingTime][DateResponseStatus.YES];
  const noNames = meetingDateTime[meetingTime][DateResponseStatus.NO];
  const noResponseNames =
    meetingDateTime[meetingTime][DateResponseStatus.NO_RESPONSE];
  const { isOpen, onOpen, onClose } = useDisclosure();

  const attendeeNames = attendees.map((attendee) => attendee.name);

  const endDate = Object.values(meetingDateTime)[0].endTime;
  const startDate = meetingTime;
  return (
    <>
      <div
        className={clsx(
          "relative rounded-full  px-4 py-2 min-w-[300px] md:min-w-[316px] flex",
          {
            "border-2 border-green-500":
              (numOfAttendees === yesNames.length &&
                meetingStatus !== MeetingStatus.MEETING_CONFIRMED) ||
              confirmedDateTime === meetingTime,

            "border border-zinc-400":
              numOfAttendees !== yesNames.length ||
              confirmedDateTime !== meetingTime,

            "hover:shadow-md hover:cursor-pointer":
              meetingStatus !== MeetingStatus.MEETING_CONFIRMED,
          }
        )}
        onClick={
          meetingStatus !== MeetingStatus.MEETING_CONFIRMED ? onOpen : undefined
        }
      >
        {formatDateTime}

        <div className="space-x-1 flex flex-row ml-auto">
          <Tooltip
            showArrow={true}
            isDisabled={yesNames.length === 0}
            content={
              <div>
                {yesNames.map((name, index) => {
                  return <ul key={index}>{name}</ul>;
                })}
              </div>
            }
          >
            <div className="rounded-full w-6 h-6 bg-green-400 text-center text-white">
              {yesNames.length}
            </div>
          </Tooltip>

          <Tooltip
            showArrow={true}
            isDisabled={noNames.length === 0}
            content={
              <div>
                {noNames.map((name, index) => {
                  return <ul key={index}>{name}</ul>;
                })}
              </div>
            }
          >
            <div className="rounded-full w-6 h-6 bg-red-400 text-center text-white">
              {noNames.length}
            </div>
          </Tooltip>
        </div>
      </div>

      <ConfirmMeeting
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        attendeeNames={attendeeNames}
        formatDateTime={formatDateTime}
        meetingId={meetingId}
        startDate={startDate}
        endDate={endDate}
        meetingStatus={meetingStatus}
        mutateInvitations={mutateInvitations}
      />
    </>
  );
};

export default TimeChip;
