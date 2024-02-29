import React, { ReactNode } from "react";
import {
  Box,
  Flex,
  HStack,
  Link,
  IconButton,
  Button,
  useDisclosure,
  useColorModeValue,
  Image,
  Avatar,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  PopoverFooter,
  Text,
  useToast,
  Stack,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { useMeteorAuth } from "../providers/Auth";
import { Meteor } from "meteor/meteor";
import { useNavigate } from "react-router-dom";
import { TOAST_PRESET } from "/imports/constants/toast";

const LINKS = ["Dashboard"];

type NavLinkProps = {
  onClick?: () => void;
  children: ReactNode;
};
const NavLink = (props: NavLinkProps) => {
  const { onClick, children } = props;
  return (
    <Link
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: useColorModeValue("orange.500", "orange.700"),
      }}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export const NavigationBar = () => {
  const {
    isOpen: isHamburgerMenuOpen,
    onOpen: onHamburgerMenuOpen,
    onClose: onHamburgerMenuClose,
  } = useDisclosure();
  const {
    isOpen: isUserMenuOpen,
    onOpen: onUserMenuOpen,
    onClose: onUserMenuClose,
  } = useDisclosure();
  const { user, loggedIn } = useMeteorAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const onLogout = () => {
    Meteor.logout((error: Error | Meteor.Error | undefined) => {
      if (error) {
        const meteorError = error as Meteor.Error;
        console.error(meteorError);
        toast({
          ...TOAST_PRESET,
          title: meteorError.name,
          description: meteorError.message,
          status: "error",
        });
      } else {
        toast({
          ...TOAST_PRESET,
          title: "Success",
          description: `${user?.username} logged out`,
          status: "success",
        });
      }
    });
  };

  return (
    <Box bg="#f09000" px={4} color="white">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <IconButton
          size="md"
          icon={isHamburgerMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label="Open Menu"
          display={{ md: "none" }}
          onClick={
            isHamburgerMenuOpen ? onHamburgerMenuClose : onHamburgerMenuOpen
          }
          colorScheme="orange"
          backgroundColor="transparent"
          isDisabled={!loggedIn}
        />
        <HStack spacing={8} alignItems="center">
          <Image src="/small_logo.png" width={50} height={50} />
          <HStack as="nav" spacing={4} display={{ base: "none", md: "flex" }}>
            {loggedIn && (
              <>
                {LINKS.map((link) => (
                  <NavLink
                    key={link}
                    onClick={() => {
                      switch (link) {
                        case "Dashboard":
                          navigate("/");
                          break;
                        default:
                          break;
                      }
                    }}
                  >
                    <Text>{link}</Text>
                  </NavLink>
                ))}
              </>
            )}
          </HStack>
        </HStack>
        <Flex alignItems="center">
          <Popover
            isOpen={isUserMenuOpen}
            onOpen={onUserMenuOpen}
            closeOnBlur
            onClose={onUserMenuClose}
          >
            <PopoverTrigger>
              <Avatar
                _hover={{ cursor: "pointer", backgroundColor: "orange.600" }}
                as={Button}
                bgColor="orange.500"
                isDisabled={!loggedIn}
              />
            </PopoverTrigger>
            <PopoverContent color="black" shadow="base">
              <PopoverArrow />
              <PopoverHeader fontWeight="bold">{user?.username}</PopoverHeader>
              {/* <PopoverBody></PopoverBody> */}
              <PopoverFooter display="flex" gap={3}>
                <Button
                  key="Settings"
                  onClick={() => {
                    onUserMenuClose();
                    navigate("/settings");
                  }}
                >
                  Settings
                </Button>
                <Button
                  key="Logout"
                  onClick={() => {
                    onUserMenuClose();
                    onLogout();
                  }}
                  colorScheme="red"
                >
                  Logout
                </Button>
              </PopoverFooter>
            </PopoverContent>
          </Popover>
        </Flex>
      </Flex>

      {isHamburgerMenuOpen && (
        <Box pb={4} display={{ md: "none" }}>
          <Stack as={"nav"} spacing={4}>
            {loggedIn && (
              <>
                {LINKS.map((link) => (
                  <NavLink
                    key={link}
                    onClick={() => {
                      switch (link) {
                        case "Dashboard":
                          navigate("/");
                        default:
                          onHamburgerMenuClose();
                          break;
                      }
                    }}
                  >
                    <Text>{link}</Text>
                  </NavLink>
                ))}
              </>
            )}
          </Stack>
        </Box>
      )}
    </Box>
  );
};
