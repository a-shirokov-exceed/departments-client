import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import { getDepartments, createDepartment, editDepartment, deleteDepartment } from "../../store/actionCreators/departmentsActions";
import { createEmployee, editEmployee, deleteEmployee } from "../../store/actionCreators/employeesActions";

import SideBar from "../sidebar/sideBar";
import HeaderComponent from "../headerComponent/headerComponent";
import RenderEntity from "../renderEntity/renderEntity";
import ModalAddEdit from "../modalAddEdit/modalAddEdit";

import { Container, Snackbar, Typography } from "@mui/material";

import "./mainContainer.scss";

const MainContainer = ({ entity }) => {
  const [openModal, setOpenModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [formObject, setFormObject] = useState({});
  const [sortedEmployee, setSortedEmployee] = useState([]);
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const [snackmessage, setSnackmessage] = useState("");

  let { id } = useParams();
  const dispatch = useDispatch();
  
  useEffect(() => {
    axios
    .get("http://localhost:8000/departments")
    .then((res) => {
      setDepartments(res.data.data);
      dispatch(getDepartments(res.data.data))
    })
    .catch((err) => {
      setSnackmessage("Can not load departments");
      setSnackbarOpen(true);
    });
  }, []);
  
  
  useEffect(() => {
    if (entity === "Department") {
      setSortedEmployee([]);
    }
  }, [entity]);

  const submitForm = (entityObject) => {
    Object.keys(entityObject).map((key) => {
      if (typeof entityObject[key] === "string")
        entityObject[key] = entityObject[key].trim();
    });

    if (entity === "Department") {
      const { _id, name } = entityObject;

      if (isEdit && name) {
        axios
          .patch(`http://localhost:8000/department/edit/${_id}`, entityObject)
          .then((res) => {
            if (res) {
              const editedDepartments = departments.map((item) => {
                if (item._id === res.data._id) {
                  return res.data;
                }
                return item;
              });
              setDepartments(editedDepartments);
              dispatch(editDepartment(editedDepartments));
            }
          })
          .catch((err) => {
            setSnackmessage(
              "Edit department error. Name is required and must be unique."
            );
            setSnackbarOpen(true);
          });
      } else if (!isEdit && name) {
        axios
          .post("http://localhost:8000/department/add", entityObject)
          .then((res) => {
            if (res) {
              setDepartments([...departments, res.data.data]);
              dispatch(createDepartment(res.data.data));
            }
          })
          .catch((err) => {
            setSnackmessage(
              "Add department error. Name is required and must be unique."
            );
            setSnackbarOpen(true);
          });
      } else {
        setSnackmessage("Error. Name is required.");
        setSnackbarOpen(true);
      }
    } else {
      const tempEmployee = { ...entityObject, department: id };
      const { _id, email, name, age, position } = tempEmployee;

      if (isEdit && email && name && age && position) {
        axios
          .patch(`http://localhost:8000/employee/edit/${_id}`, tempEmployee)
          .then((res) => {
            if (res) {
              const tempSortedEmployee = sortedEmployee.map((item) => {
                if (item._id === res.data._id) {
                  return res.data;
                }
                return item;
              });
              setSortedEmployee(tempSortedEmployee);
              dispatch(editEmployee(tempSortedEmployee));
            }
          })
          .catch((err) => {
            setSnackmessage("Edit employee error. Fill all required fields.");
            setSnackbarOpen(true);
          });
      } else if (!isEdit && email && name && age && position) {
        axios
          .post("http://localhost:8000/employee/add", tempEmployee)
          .then((res) => {
            if (res) {
              setSortedEmployee([...sortedEmployee, res.data.data]);
              dispatch(createEmployee(res.data.data));
            }
          })
          .catch((err) => {
            setSnackmessage("Add employee error. Fill all required fields.");
            setSnackbarOpen(true);
          });
      } else {
        setSnackmessage("Error. Fill all required fields.");
        setSnackbarOpen(true);
      }
    }
    setOpenModal(false);
    setIsEdit(false);
  };

  const deleteEntity = (entity, entityIndex) => {
    if (entity === "Department") {
      axios
        .delete(`http://localhost:8000/department/delete/${entity._id}`)
        .then((res) => {
          departments.splice(entityIndex, 1);
          setDepartments([...departments]);
          dispatch(deleteDepartment(entity._id));
        })
        .catch(() => {
          setSnackmessage("Can not delete department with employee");
          setSnackbarOpen(true);
        });
    } else {
      axios
        .delete(`http://localhost:8000/employee/delete/${entity._id}`)
        .then(() => {
          const index = sortedEmployee.indexOf(entity);
          sortedEmployee.splice(index, 1);
          setSortedEmployee([...sortedEmployee]);
          dispatch(deleteEmployee(entity._id));
        })
        .catch(() => {
          setSnackmessage("Can not find deleted employee");
          setSnackbarOpen(true);
        });
    }
  };

  return (
    <>
      <Typography className="header" variant="h1">
        Department CMS
      </Typography>      
      <Container className="main-container">      
        <SideBar />
        <Container className="content">
          <HeaderComponent openModal={setOpenModal} entity={entity} />
          <RenderEntity
            entity={entity}
            departments={departments}
            openModal={setOpenModal}
            setIsEdit={setIsEdit}
            setFormObject={setFormObject}
            deleteEntity={deleteEntity}
            currentDepartment={id}
            sortedEmployee={sortedEmployee}
            setSortedEmployee={setSortedEmployee}
            setSnackmessage={setSnackmessage}
            setSnackbarOpen={setSnackbarOpen}
          />
        </Container>
        <ModalAddEdit
          openModal={openModal}
          closeHandler={setOpenModal}
          entity={entity}
          isEdit={isEdit}
          submitForm={submitForm}
          formObject={formObject}
          setFormObject={setFormObject}
          setIsEdit={setIsEdit}
        />
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={isSnackbarOpen}
          autoHideDuration={2000}
          onClose={() => setSnackbarOpen(false)}
          message={snackmessage}
        />
      </Container>
    </>
  );
};

export default MainContainer;
