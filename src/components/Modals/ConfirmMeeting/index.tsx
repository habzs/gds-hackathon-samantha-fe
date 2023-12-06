import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { CalendarDaysIcon, UserIcon } from "@heroicons/react/24/outline";

import {
  ModalContent,
  ModalHeader,
  ModalBody,
  Modal,
  Button,
} from "@nextui-org/react";
import { ApiService } from "@/services/api/api.api";
import { MeetingStatus } from "@/utils/meetings.types";
import { useEffect, useState } from "react";

interface ConfirmMeetingProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  attendeeNames: string[];
  formatDateTime: string;
  meetingId: string;
  startDate: string;
  endDate: string;
  meetingStatus: MeetingStatus;
  mutateInvitations: () => void;
}

enum ConfirmStep {
  CONFIRM_CONFIRMATION = 0,
  VENUE_CONFIRMED = 1,
  ONLINE_CONFIRMED = 2,
}

const teamsLogo = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="25"
    height="24"
    viewBox="0 0 25 24"
    fill="none"
  >
    <path
      d="M22.5 11V15C22.5 16.657 21.157 18 19.5 18C17.843 18 16.5 16.657 16.5 15V10H21.5C22.0525 10 22.5 10.4475 22.5 11ZM19.5 8C20.6045 8 21.5 7.1045 21.5 6C21.5 4.8955 20.6045 4 19.5 4C18.3955 4 17.5 4.8955 17.5 6C17.5 7.1045 18.3955 8 19.5 8Z"
      fill="#5059C9"
    />
    <path
      d="M18 11V16.5C18 19.3715 15.5795 21.678 12.667 21.489C10.0095 21.317 8 18.9915 8 16.3285V10H17C17.5525 10 18 10.4475 18 11ZM13 8.5C14.657 8.5 16 7.157 16 5.5C16 3.843 14.657 2.5 13 2.5C11.343 2.5 10 3.843 10 5.5C10 7.157 11.343 8.5 13 8.5Z"
      fill="#7B83EB"
    />
    <path
      d="M13 8.5C14.6569 8.5 16 7.15685 16 5.5C16 3.84315 14.6569 2.5 13 2.5C11.3431 2.5 10 3.84315 10 5.5C10 7.15685 11.3431 8.5 13 8.5Z"
      fill="#7B83EB"
    />
    <path
      opacity="0.05"
      d="M13.5 16.6595V10H8V16.3285C8 17.0955 8.1715 17.8325 8.472 18.5H11.659C12.676 18.5 13.5 17.676 13.5 16.6595Z"
      fill="black"
    />
    <path
      opacity="0.07"
      d="M8 10V16.3285C8 16.9085 8.1005 17.4705 8.277 18H11.606C12.468 18 13.1665 17.3015 13.1665 16.4395V10H8Z"
      fill="black"
    />
    <path
      opacity="0.09"
      d="M12.8335 10H8V16.3285C8 16.7295 8.0505 17.1205 8.137 17.5H11.553C12.26 17.5 12.833 16.927 12.833 16.22L12.8335 10Z"
      fill="black"
    />
    <path
      d="M11.5 17H3.5C2.9475 17 2.5 16.5525 2.5 16V8C2.5 7.4475 2.9475 7 3.5 7H11.5C12.0525 7 12.5 7.4475 12.5 8V16C12.5 16.5525 12.0525 17 11.5 17Z"
      fill="url(#paint0_linear_1125_7750)"
    />
    <path
      d="M9.534 9.49902H5.466V10.359H6.9895V14.499H8.0105V10.359H9.534V9.49902Z"
      fill="white"
    />
    <defs>
      <linearGradient
        id="paint0_linear_1125_7750"
        x1="2.824"
        y1="7.324"
        x2="12.2015"
        y2="16.7015"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5961C3" />
        <stop offset="1" stopColor="#3A41AC" />
      </linearGradient>
    </defs>
  </svg>
);

const ConfirmMeeting: React.FC<ConfirmMeetingProps> = ({
  isOpen,
  onClose,
  title,
  attendeeNames,
  formatDateTime,
  meetingId,
  startDate,
  endDate,
  meetingStatus,
  mutateInvitations,
}) => {
  const [confirmStep, setConfirmStep] = useState(
    ConfirmStep.CONFIRM_CONFIRMATION
  );
  const [venue, setVenue] = useState<string>("");
  const [contentView, setContentView] = useState<JSX.Element>();
  const [isConfirmLoading, setisConfirmLoading] = useState(false);

  const createMeetingConfirmation = async (room: boolean) => {
    setisConfirmLoading(true);
    try {
      const res = await ApiService.createMeetingConfirmation(
        meetingId,
        startDate,
        endDate,
        room
      );

      if (res.status === 200) {
        const data = res.data;

        if (data.bookedRoom) {
          setConfirmStep(ConfirmStep.VENUE_CONFIRMED);
          setVenue(data.bookedRoom);
        } else {
          setConfirmStep(ConfirmStep.ONLINE_CONFIRMED);
        }
      }
      setisConfirmLoading(false);
      mutateInvitations();
    } catch (err) {}
  };

  const handleMeetingConfirmation = async (room: boolean) => {
    await createMeetingConfirmation(room);
  };

  const confirmConfirmation = (
    <ModalBody className="mt-4 space-y-4 mx-auto w-full text-center mb-[24px]">
      <div className="text-default-800 space-y-4">
        <p>{title}</p>
        <div className="space-x-4">
          <span className="inline-block align-bottom">
            <UserIcon className="h-6" />
          </span>
          <span className="inline-block">{attendeeNames.join(", ")}</span>
        </div>
        <div className="space-x-4">
          <span className="inline-block align-bottom">
            <CalendarDaysIcon className="h-6" />
          </span>
          <span className="inline-block">{formatDateTime}</span>
        </div>
      </div>

      <p className="text-lg font-semibold">
        Do you need Samantha to book a physical venue?
      </p>

      <div className="space-x-8 flex justify-center">
        <Button size="lg" onClick={() => handleMeetingConfirmation(false)}>
          No
        </Button>

        <Button
          size="lg"
          color="primary"
          isLoading={isConfirmLoading}
          spinner={
            <svg
              className="animate-spin h-5 w-5 text-current"
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                fill="currentColor"
              />
            </svg>
          }
          onClick={() => {
            handleMeetingConfirmation(true);
          }}
        >
          Yes
        </Button>
      </div>
    </ModalBody>
  );

  const venueConfirmed = (
    <ModalBody className="mt-4 space-y-4 mx-auto w-full text-center mb-[24px]">
      <span>
        <CheckCircleIcon className="h-36 text-green-700 mx-auto" />
      </span>
      <div className="text-default-800 space-y-4 mx-auto">
        <p className="text-lg font-semibold">Venue confirmed</p>
        <div className="mt-8  max-w-xs">
          <p>{formatDateTime}</p>
          <p>{venue}</p>
        </div>
      </div>

      <p className="text-zinc-500">
        *Confirmation emails have been sent to all attendees
      </p>

      <div className="space-x-8">
        <Button
          size="lg"
          color="primary"
          onClick={() => {
            //reload window
            onClose();
            // window.location.reload();
          }}
        >
          Okay
        </Button>
      </div>
    </ModalBody>
  );

  const onlineConfirmed = (
    <ModalBody className="mt-4 space-y-4 mx-auto w-full text-center mb-[24px]">
      <span>
        <CheckCircleIcon className="h-36 text-green-700 mx-auto" />
      </span>
      <div className="text-default-800 space-y-4 mx-auto">
        <p className="text-lg font-semibold">Meeting confirmed</p>
        <div className="mt-8  max-w-xs">
          <p>{formatDateTime}</p>
        </div>
      </div>

      <p className="text-zinc-500">
        *Confirmation emails have been sent to all attendees
      </p>

      <div className="flex justify-center space-x-2 text-blue-500 hover:cursor-pointer">
        <span>{teamsLogo}</span>
        <span>Copy meeting link</span>
      </div>

      <div className="space-x-8">
        <Button
          size="lg"
          color="primary"
          onClick={() => {
            onClose();
            // window.location.reload();
          }}
        >
          Okay
        </Button>
      </div>
    </ModalBody>
  );

  useEffect(() => {
    switch (confirmStep) {
      case ConfirmStep.CONFIRM_CONFIRMATION:
        setContentView(confirmConfirmation);
        break;
      case ConfirmStep.VENUE_CONFIRMED:
        setContentView(venueConfirmed);
        break;
      case ConfirmStep.ONLINE_CONFIRMED:
        setContentView(onlineConfirmed);
        break;
      default:
        setContentView(confirmConfirmation);
    }
  }, [confirmStep]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 shadow-md sticky top-0 z-20 backdrop-blur bg-white/70">
              <div className="flex items-center gap-x-3">
                <p>Confirm meeting</p>

                <div className="ml-auto">
                  <XMarkIcon
                    className="h-6 w-6 hover:cursor-pointer"
                    onClick={() => onClose()}
                  />
                </div>
              </div>
            </ModalHeader>

            {contentView}
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ConfirmMeeting;
