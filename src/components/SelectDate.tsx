import React from "react";

interface Props {
  selectedDate: string;
  nextDateonClick: () => void;
  previousDateonClick: () => void;
}

const SelectDate = ({
  selectedDate,
  nextDateonClick,
  previousDateonClick,
}: Props) => {
  return (
    <>
      <button
        type="button"
        className={"btn btn-primary"}
        onClick={previousDateonClick}
      >
        Previous day
      </button>
      <div>{selectedDate}</div>
      <button
        type="button"
        className={"btn btn-primary"}
        onClick={nextDateonClick}
      >
        Next day
      </button>
    </>
  );
};

export default SelectDate;
