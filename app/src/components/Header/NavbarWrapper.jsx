"use client";

import React from 'react';
import Navbar from './NavBar';
import ClientNavbar from '../Client/ClientNavbar';
import { useAuth } from '../../contexts/AuthContext';

export default function NavbarWrapper() {
    const { user, isAuthenticated } = useAuth();
    const authenticated = isAuthenticated();
    const role = user?.role?.toLowerCase();
    const isClientUser = authenticated && (role === "individual" || role === "professional");

    return isClientUser ? <ClientNavbar /> : <Navbar />;
}
