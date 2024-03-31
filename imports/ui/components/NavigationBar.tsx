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
import { Color } from "/imports/constants";

const LINKS = ["Dashboard", "Other Users"];

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
  const { profile } = user || {};
  const { firstName, lastName, profilePictureUrl } = profile || {};
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
    <Box bg={Color.DARK_ORANGE} px={4} color={Color.WHITE}>
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
                        case "Other Users":
                          navigate("/other-users");
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
            flip
            arrowShadowColor="none"
          >
            <PopoverTrigger>
              <Avatar
                _hover={{ cursor: "pointer", backgroundColor: "orange.600" }}
                as={IconButton}
                bgColor="orange.500"
                isDisabled={!loggedIn}
                name={[firstName, lastName].filter(Boolean).join(" ")}
                color={Color.WHITE}
                src={profilePictureUrl}
              />
            </PopoverTrigger>
            <PopoverContent
              color={Color.WHITE}
              shadow="base"
              bgColor={Color.DARK_ORANGE}
              border={0}
              zIndex={1}
              boxShadow={`inset 0 -3em 3em rgb(0 200 0 / 30%),
              0.3em 0.3em 1em rgb(200 0 0 / 60%)`}
              marginTop={1}
            >
              <PopoverArrow bgColor={Color.DARK_ORANGE} />
              <PopoverHeader fontWeight="bold" border={0}>
                {user?.username}
              </PopoverHeader>
              {/* <PopoverBody></PopoverBody> */}
              <PopoverFooter display="flex" gap={3} border={0}>
                <Button
                  key="Settings"
                  onClick={() => {
                    onUserMenuClose();
                    navigate("/settings");
                  }}
                  colorScheme="orange"
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
                          break;
                        case "Other Users":
                          navigate("/other-users");
                          break;
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
