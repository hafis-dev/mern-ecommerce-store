import { useEffect, useState } from "react";
import { Container, Card, Form, Button, Row, Col, Nav, Tab, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import api from "../../../services/api/axios";
import styles from "./profilePage.module.css"; // Import the CSS Module

const ProfilePage = () => {
    const [loading, setLoading] = useState(true);

    const [profile, setProfile] = useState({
        username: "",
        email: "",
        phone: "",
        isAdmin: false,
        createdAt: "",
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
    });

    // =====================
    // LOAD PROFILE
    // =====================
    const loadProfile = async () => {
        try {
            setLoading(true);
            const res = await api.get("/profile/me");
            setProfile(res.data);
        } catch (err) {
            console.log(err);
            toast.error("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    // =====================
    // UPDATE PROFILE
    // =====================
    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.put("/profile", {
                username: profile.username,
                email: profile.email,
            });
            setProfile(res.data);
            toast.success("Profile updated");
        } catch (err) {
            console.log(err);
            toast.error("Failed to update profile");
        }
    };

    // =====================
    // CHANGE PASSWORD
    // =====================
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put("/profile/password", passwordData);
            toast.success("Password changed");
            setPasswordData({ currentPassword: "", newPassword: "" });
        } catch (err) {
            console.log(err);
            toast.error(
                err?.response?.data?.message || "Failed to change password"
            );
        }
    };

    if (loading) return <p className={styles.loadingText}>Loading profile...</p>;

    return (
        <Container className="py-5 mt-4">
            {/* HEADER SUMMARY CARD */}
            <Card className={`mb-4 border-0 shadow-sm ${styles.customCard}`}>
                <Card.Body className="p-4">
                    <div className="d-flex align-items-center">
                        <div className={`d-flex justify-content-center align-items-center rounded-circle me-4 ${styles.avatar}`}>
                            {profile.username?.charAt(0).toUpperCase()}
                        </div>

                        <div>
                            <h3 className={styles.username}>{profile.username}</h3>
                            <div className={styles.email}>{profile.email}</div>
                            <span className={styles.joinedDate}>
                                Joined: {new Date(profile.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </Card.Body>
            </Card>

            {/* TABBED INTERFACE */}
            <Tab.Container id="profile-tabs" defaultActiveKey="account">
                <Row>
                    {/* LEFT SIDEBAR NAVIGATION */}
                    <Col md={3} className="mb-3">
                        <Card className={styles.customCard}>
                            <Card.Body className="p-2">
                                <Nav variant="pills" className="flex-column">
                                    <Nav.Item>
                                        <Nav.Link eventKey="account" className={styles.navLink}>
                                            Account Settings
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="security" className={styles.navLink}>
                                            Security & Password
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* RIGHT CONTENT AREA */}
                    <Col md={9}>
                        <Tab.Content>
                            {/* ACCOUNT TAB */}
                            <Tab.Pane eventKey="account">
                                <Card className={styles.customCard}>
                                    <Card.Body className="p-4">
                                        <h5 className={styles.sectionTitle}>
                                            Personal Information
                                        </h5>
                                        <Form onSubmit={handleProfileSubmit}>
                                            <Row>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label className={styles.formLabel}>Username</Form.Label>
                                                        <Form.Control
                                                            value={profile.username}
                                                            onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                                                            className={styles.formControl}
                                                        />
                                                    </Form.Group>
                                                </Col>

                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label className={styles.formLabel}>Phone Number</Form.Label>
                                                        <Form.Control
                                                            value={profile.phone}
                                                            disabled
                                                            className={styles.formControl}
                                                        />
                                                    </Form.Group>
                                                </Col>

                                                <Col md={12}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label className={styles.formLabel}>Email Address</Form.Label>
                                                        <Form.Control
                                                            type="email"
                                                            value={profile.email}
                                                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                                            className={styles.formControl}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <div className="d-flex justify-content-end mt-3">
                                                <Button type="submit" className={styles.formBtn}>
                                                    Save Changes
                                                </Button>
                                            </div>
                                        </Form>
                                    </Card.Body>
                                </Card>
                            </Tab.Pane>

                            {/* SECURITY TAB */}
                            <Tab.Pane eventKey="security">
                                <Card className={styles.customCard}>
                                    <Card.Body className="p-4">
                                        <h5 className={styles.sectionTitle}>
                                            Change Password
                                        </h5>
                                        <Form onSubmit={handlePasswordSubmit}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className={styles.formLabel}>Current Password</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    value={passwordData.currentPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                    className={styles.formControl}
                                                />
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label className={styles.formLabel}>New Password</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    value={passwordData.newPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                    className={styles.formControl}
                                                />
                                            </Form.Group>

                                            <div className="d-flex justify-content-end mt-3">
                                                <Button type="submit" className={styles.pwdBtn}>
                                                    Update Password
                                                </Button>
                                            </div>
                                        </Form>
                                    </Card.Body>
                                </Card>
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </Container>
    );
};

export default ProfilePage;