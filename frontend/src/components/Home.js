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
import CardFooter from "@material-tailwind/react/CardFooter";
import H6 from "@material-tailwind/react/Heading6";
import Paragraph from "@material-tailwind/react/Paragraph";
import Button from "@material-tailwind/react/Button";
import { render } from 'react-dom';


var API = process.env.REACT_APP_API;

export const Home = () => {

    const closeSession = async (e) => {
        localStorage.setItem(isLogged, false);
        window.location = "/login";
    };

    const [users, setUsers] = useState([]);

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
        })
        console.log(await res.json())
        setUsers(await res.json())
        
    }



    useEffect(() => {
        getUsers();
    }, [])

    const [openNavbar, setOpenNavbar] = useState(false);
    console.log(localStorage.getItem(isLogged))
    if (!localStorage.getItem(isLogged)) {
        window.location = "/login";
        return;
    }



    return (
        <div>
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
                        </Nav>
                    </NavbarCollapse>
                </NavbarContainer>
            </Navbar>
            ${users.data.allUsers.edges.map(user => {
                    <Card>
                        <CardBody>
                            <H6 color="gray">${user.node.username}</H6>
                            <Paragraph color="gray">
                                ${user.node.password}
                            </Paragraph>
                        </CardBody>
                    </Card>
                })}
        </div>
    );
}