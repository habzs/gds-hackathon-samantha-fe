import {
  AttendeeStatus,
  AttendeeType,
  DateResponseStatus,
  MeetingDateTimeTypes,
  MeetingStatus,
  SamProgress,
} from "@/utils/meetings.types";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { Step, StepLabel, Stepper } from "@mui/material";
import {
  Card,
  CardBody,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  User,
} from "@nextui-org/react";
import moment from "moment";
import { Fragment, ReactNode, useCallback, useMemo } from "react";
import TimeChip from "./TimeChip";

interface MeetingDetailsModalProps {
  isOpen: boolean;
  attendees: AttendeeType[];
  onClose: () => void;
  title: string;
  meetingStatusChip: ReactNode;
  samProgress: SamProgress;
  compatDates: number;
  meetingId: string;
  meetingStatus: MeetingStatus;
  confirmedDateTime?: string;
  mutateInvitations: () => void;
}

const userTableColumns = [
  { name: "NAME", uid: "name" },
  { name: "ROLE", uid: "role" },
  { name: "STATUS", uid: "status" },
];

const MeetingDetailsModal: React.FC<MeetingDetailsModalProps> = ({
  isOpen,
  attendees,
  onClose,
  title,
  meetingStatusChip,
  samProgress,
  compatDates,
  meetingId,
  meetingStatus,
  confirmedDateTime,
  mutateInvitations,
}) => {
  const steps = Object.values(SamProgress);
  const activeSamStep = steps.indexOf(samProgress);

  const attendeesWithKey = attendees.map((attendee, index) => ({
    ...attendee,
    key: index,
  }));

  const numOfAttendees = attendees.length;

  const startDate = attendees[0].dateResponse[0].startDate;
  const endDate = attendees[0].dateResponse[0].endDate;

  const meetingDateTimes: MeetingDateTimeTypes[] = useMemo(() => {
    let tempMeetingDateTimes: MeetingDateTimeTypes[] = [];

    attendees.forEach((attendee) => {
      attendee.dateResponse.forEach((dateResponse) => {
        let dateTime = dateResponse.startDate;
        let endTime = dateResponse.endDate;
        let status = dateResponse.status;
        let attendeeName = attendee.name;

        let existingDateTimeIndex = tempMeetingDateTimes.findIndex((item) =>
          item.hasOwnProperty(dateTime)
        );

        if (existingDateTimeIndex !== -1) {
          let existingDateTime = tempMeetingDateTimes[existingDateTimeIndex];
          let updatedDateTime = {
            ...existingDateTime,
            [dateTime]: {
              ...existingDateTime[dateTime],
              [status]: [
                ...(existingDateTime[dateTime][status] || []),
                attendeeName,
              ],
            },
          };
          tempMeetingDateTimes[existingDateTimeIndex] = updatedDateTime;
        } else {
          let newDateTime = {
            [dateTime]: {
              endTime: endTime,
              [DateResponseStatus.YES]: [],
              [DateResponseStatus.NO]: [],
              [DateResponseStatus.NO_RESPONSE]: [],
              [status]: [attendeeName],
            },
          };
          tempMeetingDateTimes.push(newDateTime);
        }
      });
    });

    return tempMeetingDateTimes;
  }, [attendees]); // assuming attendees is a prop or part of the component's state

  const getStatusChip = (responseStatus: AttendeeStatus) => {
    switch (responseStatus) {
      case AttendeeStatus.RESPONDED:
        return (
          <Chip
            radius="full"
            color="success"
            variant="flat"
            className="self-start"
          >
            {responseStatus}
          </Chip>
        );

      case AttendeeStatus.PENDING_RESPONSE:
        return (
          <Chip
            radius="full"
            color="warning"
            variant="flat"
            className="self-start whitespace-normal break-words"
          >
            {responseStatus}
          </Chip>
        );

      case AttendeeStatus.UNAVAILABLE:
        return (
          <Chip
            radius="full"
            color="danger"
            variant="flat"
            className="self-start"
          >
            {responseStatus}
          </Chip>
        );
    }
  };

  const renderCell = useCallback(
    (employees: AttendeeType, columnKey: React.Key) => {
      let cellValue = employees[columnKey as keyof AttendeeType];

      if (Array.isArray(cellValue)) {
        cellValue = cellValue.join(", ");
      }

      switch (columnKey) {
        case "name":
          return (
            <User
              //   avatarProps={{ radius: "full", src: employees.avatar }}
              description={employees.email}
              name={cellValue}
            >
              {employees.email}
            </User>
          );
        case "role":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">{employees.role}</p>
              {/* <p className="text-bold text-sm capitalize text-default-400">
                {employees.roleInformation}
              </p> */}
            </div>
          );
        case "status":
          return getStatusChip(employees.attendeeStatus);
        default:
          return cellValue;
      }
    },
    []
  );

  const meetingDuration = moment(attendees[0].dateResponse[0].endDate).diff(
    moment(attendees[0].dateResponse[0].startDate),
    "hours"
  );

  return (
    <>
      <Modal
        size="5xl"
        isOpen={isOpen}
        onClose={onClose}
        hideCloseButton
        className="max-h-[85vh] overflow-auto"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 shadow-md sticky top-0 z-20 backdrop-blur bg-white/70">
                <div className="flex items-center gap-x-3">
                  <p>{title}</p>
                  {meetingStatusChip}
                  <div className="ml-auto">
                    <XMarkIcon
                      className="h-6 w-6 hover:cursor-pointer"
                      onClick={() => onClose()}
                    />
                  </div>
                </div>
              </ModalHeader>
              <ModalBody className="mt-8 space-y-4">
                {/* Samantha progress */}
                <Card>
                  <CardBody className="space-y-4">
                    <p className="text-base font-semibold">
                      Samantha's progress
                    </p>
                    <Stepper activeStep={activeSamStep}>
                      {steps.map((label) => {
                        const stepProps: { completed?: boolean } = {};
                        const labelProps: {
                          optional?: React.ReactNode;
                        } = {};

                        return (
                          <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                          </Step>
                        );
                      })}
                    </Stepper>
                  </CardBody>
                </Card>

                {/* Meeting Dates */}
                <Card>
                  <CardBody className="space-y-4">
                    <div className="flex">
                      <span className="text-base font-semibold mr-3">
                        Meeting dates
                      </span>

                      {meetingStatus !== MeetingStatus.MEETING_CONFIRMED && (
                        <span className="text-base text-zinc-500">
                          {compatDates} compatible dates
                        </span>
                      )}

                      <span className="text-base ml-auto text-zinc-500">
                        {meetingDuration} hour(s)
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 ">
                      {meetingDateTimes.map((meetingDateTime, index) => {
                        return (
                          <Fragment key={index}>
                            <TimeChip
                              meetingDateTime={meetingDateTime}
                              numOfAttendees={numOfAttendees}
                              meetingId={meetingId}
                              attendees={attendees}
                              title={title}
                              meetingStatus={meetingStatus}
                              confirmedDateTime={confirmedDateTime}
                              mutateInvitations={mutateInvitations}
                            />
                          </Fragment>
                        );
                      })}
                    </div>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody className="space-y-4">
                    <div className="flex">
                      <span className="font-semibold mr-4">
                        {numOfAttendees} Attendees
                      </span>
                      <span className="text-zinc-500">
                        {attendees.filter((x) => x.role == "Internal").length}{" "}
                        internal,{" "}
                        {attendees.filter((x) => x.role == "Visitor").length}{" "}
                        visitors
                      </span>
                      <span className="text-zinc-500 ml-auto">
                        {
                          attendees.filter(
                            (x) =>
                              x.attendeeStatus == AttendeeStatus.RESPONDED ||
                              x.attendeeStatus == AttendeeStatus.UNAVAILABLE
                          ).length
                        }{" "}
                        responded
                      </span>
                    </div>
                    <Table
                      aria-label="Example table with custom cells"
                      removeWrapper
                      isStriped
                    >
                      <TableHeader columns={userTableColumns}>
                        {(column) => (
                          <TableColumn
                            key={column.uid}
                            align={
                              column.uid === "actions" ? "center" : "start"
                            }
                          >
                            {column.name}
                          </TableColumn>
                        )}
                      </TableHeader>

                      <TableBody items={attendeesWithKey}>
                        {(item) => (
                          <TableRow key={item.key}>
                            {(columnKey) => (
                              <TableCell>
                                {renderCell(item, columnKey)}
                              </TableCell>
                            )}
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardBody>
                </Card>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default MeetingDetailsModal;
