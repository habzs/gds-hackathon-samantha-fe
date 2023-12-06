import axios from "axios";

import { backendAxios } from "../backendAxios";
import { Meeting, MeetingDateTimeTypes } from "@/utils/meetings.types";

//=== 1. GET BMGW HUNT TRANSACTIONS ====================================
export const promptSam = async (message: string, id?: string) => {
  const res = await backendAxios.post<any>(
    `/gpt/${id ? id : ""}`,
    { message } // This will be in the request body

    // withCredentials: true,
  );
  return res;
};

export const getConvoList = async (message: string, id?: string) => {
  const res = await backendAxios.get<GetConvosResponse[]>(
    `/conversation/get-convo-ids`
  );

  // withCredentials: true,
  return res.data;
};

export type GetConvosResponse = {
  id: string;
  title: string;
};

export const getConvoWithId = async (id: string) => {
  const res = await backendAxios.get<GetConvoWithIDResponse[]>(
    `/conversation/get-convo`,
    { params: { convoId: id } }

    // withCredentials: true,
  );
  return res;
};

export type GetConvoWithIDResponse = {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
};

export const getDashboardInvitations = async () => {
  const res = await backendAxios.get<Meeting[]>(
    `/invitation/invitation-dashboard`
  );
  return res.data;
};

export const createMeetingConfirmation = async (
  meetingId: string,
  startDate: string,
  endDate: string,
  room: boolean
) => {
  const res = await backendAxios.post<any>(
    `/confirmation/create-confirmation`,
    {
      invitationViewId: meetingId,
      confirmedStartDate: startDate,
      confirmedEndDate: endDate,
      room: room,
    }
  );
  return res;
};

//=======================================
export const ApiService = {
  promptSam,
  getConvoList,
  getConvoWithId,
  getDashboardInvitations,
  createMeetingConfirmation,
};
