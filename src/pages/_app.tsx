import NavBar from "@/components/NavBar";
import "@/styles/globals.css";
import { NextUIProvider } from "@nextui-org/react";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";

interface PageConfigProps {
  children: React.ReactNode;
}

const inter = Inter({ subsets: ["latin"] });

const PageConfig: React.FC<PageConfigProps> = ({ children }) => {
  return (
    <div className="min-h-[calc(100vh-64px-32px)]">
      {/* <div className="mt-8 px-4 max-w-7xl mx-auto flex flex-col gap-5 md:gap-10 divide-y divide-blue-bg"> */}
      <div className="mt-8 px-4 max-w-7xl mx-auto">
        {children}
        {/* <div className="border-4 border-red-700 mx-40 mt-8 ">{children}</div> */}
      </div>
    </div>
  );
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider>
      <NavBar className="shadow-md" />
      <PageConfig>
        <Component {...pageProps} className={inter.className} />
      </PageConfig>
    </NextUIProvider>
  );
}
