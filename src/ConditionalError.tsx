import React from "react";
import Alert from "react-bootstrap/Alert";

interface Props {
  readonly error: string | undefined;
}

const ConditionalError = ({ error }: Props): JSX.Element => {
  return (
    <Alert variant="danger" hidden={!error}>
      {error}
    </Alert>
  );
};

export default ConditionalError;
