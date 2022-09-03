import React, { useState } from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
	Container,
	CssBaseline,
	Box,
	Avatar,
	Typography,
	TextField,
	Button,
	Grid,
} from "@mui/material";
import { Link } from "react-router-dom";
import { supabase } from "../../supabase/client";

const theme = createTheme();

interface LoginPageProps {
	signup?: boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({ signup }) => {
	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			setLoading(true);

			if (signup) {
				const data = await supabase.auth.signUp({
					email,
					password,
				});
				if (data.error) throw data.error;
			} else {
				const { error } = await supabase.auth.signInWithPassword({
					email,
					password,
				});
				if (error) throw error;
			}

			alert("Check your email for the login link!");
		} catch (error: any) {
			alert(error.error_description || error.message || "Could not login");
		} finally {
			setLoading(false);
		}
	};

	return (
		<ThemeProvider theme={theme}>
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<Box
					sx={{
						marginTop: 8,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						{signup ? "Sign Up" : "Sign In"}
					</Typography>
					<Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
						<TextField
							margin="normal"
							required
							fullWidth
							id="email"
							label="Email Address"
							name="email"
							autoComplete="email"
							autoFocus
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							autoComplete="current-password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
							disabled={loading}
						>
							{signup ? "Create Account" : "Login"}
						</Button>
						<Grid container>
							<Grid item xs>
								<Link to="#" hidden={loading}>
									Forgot password?
								</Link>
							</Grid>
							<Grid item>
								<Link hidden={loading} to={signup ? "/login" : "/signup"}>
									{signup
										? "Already have an account? Sign In"
										: "Don't have an account? Sign Up"}
								</Link>
							</Grid>
						</Grid>
					</Box>
				</Box>
			</Container>
		</ThemeProvider>
	);
};

export default LoginPage;
