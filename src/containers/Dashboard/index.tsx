import MeetingCard from "@/components/MeetingCard";
import { ApiService } from "@/services/api/api.api";
import { Fragment } from "react";
import useSWR from "swr";

const Dashboard = () => {
  const {
    data: invitations,
    isValidating: isInvitationsLoading,
    error: invitationsError,
    mutate: mutateInvitations,
  } = useSWR("/get-convos", ApiService.getDashboardInvitations);

  return (
    <>
      <div className="space-y-8">
        <p className="text-3xl font-bold">Your meetings</p>
        <div className="flex gap-8 flex-wrap pb-10">
          {invitations &&
            invitations.map((invite, index) => (
              <Fragment key={Object.keys(invite)[0]}>
                <MeetingCard
                  meeting={invite}
                  mutateInvitations={mutateInvitations}
                />
              </Fragment>
            ))}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
