import React from "react";

interface Props {
  id?: number;
  team1: string;
  team1Score?: number;
  team1onClick?: () => void;
  selected?: boolean;
}

const TeamCard = ({ team1, team1Score }: Props) => {
  return (
    <div
      className="container"
      style={{ display: "flex", alignItems: "center" }}
    >
      <img src={`./assets/icons/${team1}.png`} alt="Team Icon" />
      {team1} ({team1Score})
    </div>
  );
};

export default TeamCard;
