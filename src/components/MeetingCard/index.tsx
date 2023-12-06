import {
  AttendeeStatus,
  DateResponseStatus,
  Meeting,
  MeetingStatus,
} from "@/utils/meetings.types";
import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  NoSymbolIcon,
} from "@heroicons/react/24/solid";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
  useDisclosure,
} from "@nextui-org/react";
import MeetingDetailsModal from "../Modals/MeetingDetailsModal";

enum ChipColorType {
  DEFAULT = "default",
  PRIMARY = "primary",
  SUCCESS = "success",
  WARNING = "warning",
  DANGER = "danger",
}

interface MeetingCardProps {
  meeting: Meeting;
  mutateInvitations: () => void;
}

let meetingStatusChipColor: ChipColorType = ChipColorType.DEFAULT;
let meetingChipStartContent = <ClockIcon className="h-5" />;

const MeetingCard: React.FC<MeetingCardProps> = ({
  meeting,
  mutateInvitations,
}) => {
  const meetingId = Object.keys(meeting)[0];
  const meetingInfo = Object.values(meeting)[0];

  const { isOpen, onOpen, onClose } = useDisclosure();

  switch (meetingInfo.meetingStatus) {
    case MeetingStatus.NO_COMPATIBLE_DATES:
      meetingStatusChipColor = ChipColorType.DANGER;
      meetingChipStartContent = <NoSymbolIcon className="h-5" />;
      break;

    case MeetingStatus.ACTION_NEEDED:
      meetingStatusChipColor = ChipColorType.WARNING;
      meetingChipStartContent = <ExclamationCircleIcon className="h-5" />;
      break;

    case MeetingStatus.MEETING_CONFIRMED:
      meetingStatusChipColor = ChipColorType.SUCCESS;
      meetingChipStartContent = <CheckCircleIcon className="h-5" />;
      break;

    case MeetingStatus.WAITING_RESPONSE:
      meetingStatusChipColor = ChipColorType.PRIMARY;
      meetingChipStartContent = <ClockIcon className="h-5" />;
      break;
  }

  const meetingStatusChip = (
    <Chip
      radius="full"
      startContent={meetingChipStartContent}
      color={meetingStatusChipColor}
      className="text-white self-start"
    >
      {meetingInfo.meetingStatus}
    </Chip>
  );

  const totalAttendees = meetingInfo.attendees.length;

  const responses = meetingInfo.attendees.filter(
    (attendee) =>
      attendee.attendeeStatus === AttendeeStatus.RESPONDED ||
      attendee.attendeeStatus === AttendeeStatus.UNAVAILABLE
  ).length;

  const totalDates = meetingInfo.attendees[0].dateResponse.length;

  const participantNames = meetingInfo.attendees.map(
    (attendee) => attendee.name
  );

  // get all dates
  const allDates = meetingInfo.attendees.map(
    (attendee) => attendee.dateResponse
  );

  const uniqueDates = new Set();

  // Check that all attendees have the same number of dates
  if (allDates.every((dateArray) => dateArray.length === allDates[0].length)) {
    let allYes = true;

    for (let i = 0; i < totalDates; i++) {
      allYes = true;

      allDates.forEach((dateArray) => {
        if (dateArray[i].status !== DateResponseStatus.YES) {
          allYes = false;
        }
      });

      // Step 7: if allYes is still true, add the date to uniqueDates
      if (allYes) {
        uniqueDates.add(allDates[0][i].startDate);
      }
    }
  }

  // Step 8: get the number of compatible dates
  const compatDates = uniqueDates.size;

  const handleOpen = () => {
    onOpen();
  };

  return (
    <>
      <Card
        className="basis-full md:basis-1/3 grow"
        isPressable
        disableRipple
        onPress={handleOpen}
        id={meetingId}
      >
        <CardHeader className="flex justify-between">
          <p className="font-bold text-start">{meetingInfo.meetingTitle}</p>
          {meetingStatusChip}
        </CardHeader>
        <Divider />
        <CardBody className="flex text-zinc-800">
          <p>{`${totalAttendees} visitors`}</p>
          <p className="truncate pr-5">{participantNames.join(", ")}</p>
        </CardBody>
        <Divider />
        <CardFooter className="flex flex-row justify-between text-zinc-800">
          <p>{`${responses} / ${totalAttendees} responded`}</p>
          <p>{`${compatDates} / ${meetingInfo.numOfDates} compatible dates`}</p>
        </CardFooter>
      </Card>

      <MeetingDetailsModal
        isOpen={isOpen}
        onClose={onClose}
        title={meetingInfo.meetingTitle}
        attendees={meetingInfo.attendees}
        meetingId={meetingId}
        meetingStatusChip={meetingStatusChip}
        samProgress={meetingInfo.samProgress}
        compatDates={compatDates}
        meetingStatus={meetingInfo.meetingStatus}
        confirmedDateTime={meetingInfo.confirmedDate}
        mutateInvitations={mutateInvitations}
      />
    </>
  );
};

export default MeetingCard;
