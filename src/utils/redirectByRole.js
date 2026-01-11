const roleRedirectMap = {
    student: "/student",
    teacher: "/teacher",
    admin: "/admin"
}

const  redirectByRole = (role) => {
    return roleRedirectMap[role] || "/"
}

export default redirectByRole;