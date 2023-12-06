import { ApiService } from "@/services/api/api.api";
import { ClockIcon } from "@heroicons/react/24/outline";
import { PaperAirplaneIcon, PlusIcon } from "@heroicons/react/24/solid";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Skeleton,
  Textarea,
} from "@nextui-org/react";
import clsx from "clsx";
import { Fragment, useEffect, useRef, useState } from "react";
import useSWR from "swr";

export type ConvoMetadata = {
  sender: string;
  message: string;
};

const dummyMessage = [
  {
    sender: "Samantha",
    message: "Hi! How can I help you today?",
  },
];

const Home = () => {
  const [convoView, setConvoView] = useState<ConvoMetadata[]>(dummyMessage);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isOngoingConvo, setIsOngoingConvo] = useState(false);
  const inputField = useRef<HTMLInputElement>(null);
  const convoWindowRef = useRef<HTMLDivElement>(null);
  const latestMessageRef = useRef<HTMLDivElement>(null);
  const [convoId, setConvoId] = useState<string>("");
  const [isSamThinking, setIsSamThinking] = useState(false);
  const [samError, setSamError] = useState(false);

  const {
    data: convoList,
    isValidating: isHistoryLoading,
    error: convoListError,
    mutate: mutateConvoList,
  } = useSWR("/get-convos", ApiService.getConvoList);

  const promptSam = async (convoInput: string) => {
    setIsSamThinking(true);
    const trimmedConvoInput = convoInput.trim();
    try {
      let data = await ApiService.promptSam(trimmedConvoInput, convoId);

      if (data) {
        if (data.status === 200) {
          if (!isOngoingConvo) {
            setConvoId(data.data.conversationId);
          }
          setIsOngoingConvo(true);
          setIsButtonDisabled(false);
          mutateConvoList();
        }
        setConvoView((prev) => [
          ...prev!,
          {
            sender: "Samantha",
            message: data.data.response,
          },
        ]);
        setIsSamThinking(false);
      }
    } catch (err: any) {
      setIsSamThinking(false);
      setSamError(true);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !isButtonDisabled && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewChat = () => {
    setIsOngoingConvo(false);
    setConvoId("");
    setConvoView(dummyMessage);
    setIsButtonDisabled(false);
    setIsSamThinking(false);
  };

  const handleSendMessage = () => {
    const input = inputField.current!.value;
    if (!isButtonDisabled && input !== "" && !samError) {
      // if (!isButtonDisabled && convoInput !== "") {
      setIsButtonDisabled(true);
      inputField.current!.value = "";

      setConvoView((prev) => [
        ...prev!,
        {
          sender: "You",
          message: input,
        },
      ]);

      promptSam(input);
    }
  };

  const handleLoadConversation = async (convoId: string) => {
    try {
      let data = await ApiService.getConvoWithId(convoId);

      if (data) {
        const convoBuffer = data.data;
        if (data.status === 200) {
          setConvoId(convoId);
          setIsOngoingConvo(true);
        }

        const reformattedConvoBuffer = convoBuffer.map((convo) => {
          if (convo.sender === "user") {
            return { sender: "You", message: convo.message };
          }

          if (convo.sender === "gpt") {
            return {
              sender: "Samantha",
              message: convo.message,
            };
          }

          return {
            sender: "sender",
            message: "message",
          };
        });

        setConvoView((prev) => {
          return [...dummyMessage, ...reformattedConvoBuffer];
        });

        inputField.current!.value = "";
      }
    } catch (err: any) {}
  };

  const Divider = () => {
    return <div className="border-1 border-zinc-200" />;
  };

  useEffect(() => {
    convoWindowRef.current!.scrollTo({
      top: convoWindowRef.current!.scrollHeight,
      behavior: "smooth",
    });
  }, [convoView]);

  return (
    <>
      <div className="flex">
        <div className="relative basis-full md:basis-3/4">
          <div
            className="overflow-auto h-[calc(100vh-64px-32px)] space-y-4 pb-[106px]"
            ref={convoWindowRef}
          >
            {convoView ? (
              convoView.map((message, index) => (
                <Fragment key={index}>
                  <div key={index} className="flex" ref={latestMessageRef}>
                    <p
                      className={clsx("mr-2 basis-1/12 min-w-[80px] text-end", {
                        "text-primary": message!.sender === "Samantha",
                      })}
                    >
                      {message!.sender}:
                    </p>
                    <p className="flex-1 basis-11/12 whitespace-pre-wrap ">
                      {message!.message}
                    </p>
                  </div>
                  {index < convoView.length - 1 && <Divider />}
                </Fragment>
              ))
            ) : (
              <>naur</>
            )}
            {(isSamThinking || samError) && (
              <>
                <Divider />
                <div className="flex">
                  <p className="mr-2 basis-1/12 min-w-[80px] text-end text-primary">
                    Samantha:
                    {/* <Spinner /> */}
                  </p>
                  {samError ? (
                    <div
                      className="flex flex-col space-y-4
                  "
                    >
                      <p className="text-danger">
                        Samantha is currently busy, please try again later.
                      </p>
                      <div className="">
                        <Button
                          color="primary"
                          onClick={() => {
                            window.location.reload();
                          }}
                        >
                          Refresh the page
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="basis-11/12 self-center space-y-2 mt-1">
                      <Skeleton className="rounded-lg">
                        <div className="h-4 w-full rounded-lg bg-secondary" />
                      </Skeleton>
                      <Skeleton className="rounded-lg">
                        <div className="h-4 w-full rounded-lg bg-secondary" />
                      </Skeleton>
                      <Skeleton className="w-3/6 rounded-lg">
                        <div className="h-4 w-full rounded-lg bg-secondary" />
                      </Skeleton>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="absolute bottom-0 pt-10 pb-3 w-full bg-gradient-to-t from-white via-white via-70%">
            {convoView.length <= 1 && (
              <div className="flex flex-col md:flex-row gap-4 md:gap-8 w-full bottom-24 z-30 mb-4">
                <div
                  className="border-2 border-zinc-200 rounded-xl flex flex-col p-3 basis-1/2"
                  onClick={() => {
                    inputField.current!.value =
                      "Could you give me the available venues for tomorrow from 2pm to 3pm?";
                  }}
                >
                  <p className="text-zinc-700">
                    What are the venue availabilities
                  </p>
                  <p className="text-zinc-500">For tomorrow</p>
                </div>
                <div
                  className="border-2 border-zinc-200 rounded-xl flex flex-col p-3 basis-1/2"
                  onClick={() => {
                    inputField.current!.value =
                      "I would like to schedule a meeting: \nAgenda: \nInternal participants:\n1.\nName:\nEmail:\n\n2.\nName:\nEmail:\n\nExternal participants:\n1.\nName:\nEmail:\n\n2.\nName:\nEmail:\n\nTime:";
                  }}
                >
                  <p className="text-zinc-700">Schedule a meeting</p>
                  <p className="text-zinc-500">With stakeholders</p>
                </div>
              </div>
            )}

            <div className="flex space-x-4">
              <div className="py-[5px]">
                <Button
                  size="lg"
                  radius="lg"
                  variant="bordered"
                  isDisabled={samError}
                  className="text-zinc-400 h-full hover:text-zinc-900 hover:border-zinc-900"
                  onPress={handleNewChat}
                >
                  <span className="hidden md:block">New chat</span>
                  <span className="block md:hidden">
                    <PlusIcon className="h-6 w-6" />
                  </span>
                </Button>
              </div>

              <div className="w-full relative">
                <Textarea
                  ref={inputField}
                  isDisabled={samError}
                  color="primary"
                  size="lg"
                  variant="bordered"
                  type="input"
                  placeholder="Type your response here"
                  minRows={1}
                  // maxRows={3}
                  // onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                />
                <div
                  className={clsx(
                    "absolute top-1/2 right-0 transform -translate-x-3 -translate-y-1/2",
                    {
                      "hover:cursor-pointer": !samError,
                    }
                  )}
                  onClick={handleSendMessage}
                >
                  <PaperAirplaneIcon className={"h-6 w-6 text-zinc-400"} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden md:block basis-1/4">
          <Card className="max-h-[calc(100vh-64px-48px)] mx-4 pb-4" radius="sm">
            <CardHeader className="px-[20px] flex justify-between">
              <p className="text-lg font-medium">Chat history</p>
              <ClockIcon className="h-6 w-6" />
            </CardHeader>
            <CardBody className="space-y-4 overflow-y-auto">
              {convoList &&
                convoList.map((convo, index) => (
                  <Fragment key={convo.id}>
                    <p
                      className={clsx("break-words hover:cursor-pointer", {
                        "text-blue-500": convo.id === convoId,
                      })}
                      onClick={() => handleLoadConversation(convo.id)}
                    >
                      {convo.title}
                    </p>
                    {index < convoList.length - 1 && <Divider />}
                  </Fragment>
                ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Home;
