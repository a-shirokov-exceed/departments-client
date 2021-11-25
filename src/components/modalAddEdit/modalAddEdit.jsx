import React from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Container,
} from "@mui/material";
import { ValidatorForm } from "react-material-ui-form-validator";

import UserTextField from "../userTextField/userTextField";

import "./modalAddEdit.scss";

const ModalAddEdit = ({
  openModal,
  closeHandler,
  submitForm,
  entity,
  isEdit,
  formObject,
  setFormObject,
  setIsEdit,
}) => {
  const setFieldHandler = (key, e) => {
    setFormObject({ ...formObject, [key]: e.target.value });
  };
  
  const onSubmit = (e, fObject) => {
    if (e.key === "Enter") {
      submitForm(fObject);
      setFormObject({});
    }
  };

  return (
    <ValidatorForm>
      <Dialog
        aria-labelledby="scalable-modal"
        className="scalable-modal"
        open={openModal}
        onClose={() => closeHandler(false)}
      >
        <DialogTitle>
          {isEdit ? "Edit" : "Add"}{" "}
          {entity === "Employee" ? "employee" : "department"}
        </DialogTitle>
        <DialogContent>
          {entity === "Department" ? (
            <Container
              component="form"
              onKeyPress={(e) => onSubmit(e, { ...formObject })}
            >
              <UserTextField
                currentKey="name"
                value={formObject.name}
                type="text"
                setFieldHandler={setFieldHandler}
                required={true}
              />
              <UserTextField
                currentKey="description"
                value={formObject.description}
                type="text"
                setFieldHandler={setFieldHandler}
              />
            </Container>
          ) : (
            <Container component="form">
              <UserTextField
                currentKey="email"
                value={formObject.email}
                type="email"
                setFieldHandler={setFieldHandler}
                validators={["isEmail"]}
                errorMessages={["email is not valid"]}
                required={true}
              />
              <UserTextField
                currentKey="name"
                value={formObject.name}
                type="text"
                setFieldHandler={setFieldHandler}
                required={true}
              />
              <UserTextField
                currentKey="age"
                value={formObject.age}
                type="number"
                setFieldHandler={setFieldHandler}
                validators={["minNumber:1", "maxNumber:100"]}
                errorMessages={[
                  "value must be positive",
                  "value must be less or equal 100",
                ]}
                required={true}
              />
              <UserTextField
                currentKey="position"
                value={formObject.position}
                type="text"
                setFieldHandler={setFieldHandler}
                required={true}
              />
            </Container>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              closeHandler(false);
              setFormObject({});
              setIsEdit(false);
            }}
          >
            Close
          </Button>
          <Button
            onClick={() => {
              submitForm({ ...formObject });
              setFormObject({});
            }}
            type="onSubmit"
          >
            {isEdit ? "Edit" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </ValidatorForm>
  );
};

export default ModalAddEdit;
