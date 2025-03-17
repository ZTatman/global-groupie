// Using direct imports that resolve through the import map
import React from "react";
import { createRoot } from "react-dom/client";

describe("React Test", () => {
    it("should render a React component", async () => {
        // Create a simple React component
        const TestComponent = () => {
            return React.createElement("div", null, "Hello from React");
        };

        // Create a container for our component
        const container = document.createElement("div");
        document.body.appendChild(container);

        // Render the component using createRoot from client package
        const root = createRoot(container);
        root.render(React.createElement(TestComponent));

        // Wait longer for rendering to complete
        await new Promise((resolve) => setTimeout(resolve, 100));

        console.log("Container content:", container.innerHTML);
        console.log("Text content:", container.textContent);

        // Check that the component rendered
        expect(container.textContent).toContain("Hello from React");

        // Clean up
        root.unmount();
        document.body.removeChild(container);
    });
});
