import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import "./index.css";

export default function App() {
    return <MantineProvider theme={theme}>App</MantineProvider>;
}
