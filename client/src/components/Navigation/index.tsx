import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { supabase } from "../../supabase/client";
import { useNavigate } from "react-router-dom";

/**
 * General page navigation
 */
const Navigation: React.FC = () => {
	const navigate = useNavigate();

	return (
		<BottomNavigation
			showLabels
			// value={value}
			// onChange={(event, newValue) => {
			//     setValue(newValue);
			// }}
		>
			<BottomNavigationAction label="Home" icon={<HomeIcon />} />
			<BottomNavigationAction label="Settings" icon={<SettingsIcon />} />
			<BottomNavigationAction
				label="Logout"
				icon={<LogoutIcon />}
				onClick={async () => {
					const out = await supabase.auth.signOut();
					if (out.error) {
						// todo display error
						console.error("Could not sign out");
						return;
					}

					navigate("/login");
				}}
			/>
		</BottomNavigation>
	);
};

export default Navigation;
