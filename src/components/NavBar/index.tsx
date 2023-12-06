import {
  CalendarDaysIcon,
  ChatBubbleOvalLeftEllipsisIcon,
} from "@heroicons/react/24/solid";
import {
  Button,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import { HTMLAttributes, useEffect } from "react";
import { usePathname } from "next/navigation";
import { DASHBOARD_URL, HOME_URL } from "@/services/constants";

interface NavBarProps extends HTMLAttributes<HTMLDivElement> {}

const NavBar: React.FC<NavBarProps> = ({ ...props }) => {
  let actionButton;

  if (usePathname() === DASHBOARD_URL) {
    actionButton = (
      <Button
        as={Link}
        color="primary"
        href={HOME_URL}
        variant="solid"
        startContent={<ChatBubbleOvalLeftEllipsisIcon className="h-6" />}
      >
        Talk to Sam
      </Button>
    );
  } else {
    actionButton = (
      <Button
        as={Link}
        color="secondary"
        href={DASHBOARD_URL}
        variant="solid"
        startContent={<CalendarDaysIcon className="h-6" />}
      >
        Meetings
      </Button>
    );
  }

  return (
    <Navbar {...props}>
      <NavbarBrand>
        <p className="font-semibold text-primary text-[32px]">Samantha</p>
      </NavbarBrand>
      {/* <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="#">
            Features
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="#" aria-current="page">
            Customers
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Integrations
          </Link>
        </NavbarItem>
      </NavbarContent> */}
      <NavbarContent justify="end">
        {/* <NavbarItem className="hidden lg:flex">
          <Link href="#">Login</Link>
        </NavbarItem> */}
        <NavbarItem>{actionButton}</NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default NavBar;
