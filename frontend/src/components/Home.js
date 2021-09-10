import React, { useState, useEffect } from 'react';
import './../App.css';
import "@material-tailwind/react/tailwind.css";
import { isLogged } from "../constants.js";

import Navbar from "@material-tailwind/react/Navbar";
import NavbarContainer from "@material-tailwind/react/NavbarContainer";
import NavbarWrapper from "@material-tailwind/react/NavbarWrapper";
import NavbarBrand from "@material-tailwind/react/NavbarBrand";
import NavbarToggler from "@material-tailwind/react/NavbarToggler";
import NavbarCollapse from "@material-tailwind/react/NavbarCollapse";
import Nav from "@material-tailwind/react/Nav";
import NavItem from "@material-tailwind/react/NavItem";
import Card from "@material-tailwind/react/Card";
import CardBody from "@material-tailwind/react/CardBody";
import H6 from "@material-tailwind/react/Heading6";
import Paragraph from "@material-tailwind/react/Paragraph";

import AlertMessage from './Alert';

//#region Modal
import Modal from "@material-tailwind/react/Modal";
import ModalHeader from "@material-tailwind/react/ModalHeader";
import ModalBody from "@material-tailwind/react/ModalBody";
import ModalFooter from "@material-tailwind/react/ModalFooter";
import { Input } from '@material-tailwind/react';
import { Button } from '@material-tailwind/react';
//#endregion


var API = process.env.REACT_APP_API;

export const Home = () => {

    const handleSubmit = async (e) => {
        if(e.target.username.value === "" || e.target.password.value === "" || e.target.email.value)
            window.location="/home";
        e.preventDefault();
        fetch(`${API}/graphql`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `mutation{
                    createUser(username:"${e.target.username.value}",password:"${e.target.password.value}",email:"${e.target.email.value}"){
                        user{
                            username
                            email
                        }
                      }
                  }`,
            }),
        })
        .then(res => res.json()).then(res => {
            window.location="/home";
        });
    }

    const closeSession = async (e) => {
        localStorage.setItem(isLogged, false);
        window.location = "/login";
    };

    let [users, setUsers] = useState([]);

    const getUsers = async () => {
        const res = await fetch(`${API}/graphql`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `query{
                    allUsers{
                      edges{
                        node{
                          username
                          email
                        }
                      }
                    }
                  }`,
            }),
        });
        setUsers(await res.json());
    }

    useEffect(() => {
        getUsers();
    }, [])

    const [openNavbar, setOpenNavbar] = useState(false);
    const [showModal, setShowModal] = useState(false);

    if (!localStorage.getItem(isLogged)) {
        window.location = "/login";
        return;
    }

    console.log(users);

    return (
        <div>
            <Modal size="regular" active={showModal} toggler={() => setShowModal(false)}>
                <form onSubmit={handleSubmit}>
                    <ModalHeader toggler={() => setShowModal(false)}>
                        Crear nuevo usuario
                    </ModalHeader>

                    <ModalBody>
                        <div className="mt-4 mb-8 px-4">
                            <Input
                                id="username"
                                name="username"
                                type="text"
                                color="lightBlue"
                                placeholder="Usuario"
                                outline={true}
                            />
                        </div>
                        <div className="mb-4 px-4">
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                color="lightBlue"
                                placeholder="Contraseña"
                                outline={true}
                            />
                        </div>
                        <div className="mb-4 px-4">
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                color="lightBlue"
                                placeholder="Correo Electrónico"
                                outline={true}
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="red"
                            buttonType="link"
                            onClick={(e) => setShowModal(false)}
                            ripple="dark"
                            type="button"
                        >
                            Cancelar
                        </Button>
                        <Button
                            color="green"
                            ripple="light"
                            type="submit"
                        >
                            Guardar
                        </Button>
                    </ModalFooter>
                </form>
            </Modal>
            <Navbar color="lightBlue" navbar>
                <NavbarContainer>
                    <NavbarWrapper>
                        <NavbarBrand>Usuarios</NavbarBrand>
                        <NavbarToggler
                            color="white"
                            onClick={() => setOpenNavbar(!openNavbar)}
                            ripple="light"
                        />
                    </NavbarWrapper>

                    <NavbarCollapse open={openNavbar}>
                        <Nav>
                            <NavItem ripple="light" onClick={closeSession}>Cerrar Sesión</NavItem>
                            <NavItem ripple="light" onClick={() => setShowModal(true)}>Agregar Usuario</NavItem>
                        </Nav>
                    </NavbarCollapse>
                </NavbarContainer>
            </Navbar>
            {users.length !== 0 ? users.data.allUsers.edges.map((user) => (
                <Card key={user.node.username}>
                    <CardBody>
                        <H6 color="gray">{user.node.username}</H6>
                        <Paragraph color="gray">
                            {user.node.email}
                        </Paragraph>
                    </CardBody>
                </Card>
            )) : null}
        </div>
    );

}