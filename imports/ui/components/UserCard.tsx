import React from "react";
import { Meteor } from "meteor/meteor";
import { Avatar, Button } from "@chakra-ui/react";
import { Color } from "/imports/constants";
import { useNavigate } from "react-router-dom";

type UserCardProps = {
  user: Meteor.User;
};
export const UserCard = (props: UserCardProps) => {
  const { user } = props;
  const { _id, username = "", profile } = user;
  const navigate = useNavigate();
  const { profilePictureUrl } = profile || {};

  return (
    <Button
      colorScheme="orange"
      bgColor={Color.DARK_ORANGE}
      color={Color.WHITE}
      leftIcon={<Avatar bgColor="orange.500" src={profilePictureUrl} />}
      size="lg"
      padding={8}
      onClick={() => navigate(`/${_id}`)}
    >
      {username}
    </Button>
  );
};
