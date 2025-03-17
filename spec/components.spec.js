// Testing components with React.createElement approach
import React from "react";
import { createRoot } from "react-dom/client";

describe("Complex Component Test", () => {
    it("should render a component with multiple elements", async () => {
        // Create a simple React component using createElement
        const ListItem = ({ text }) => {
            return React.createElement("li", { className: "list-item" }, text);
        };

        const TestComponent = () => {
            return React.createElement("div", { className: "container" }, [
                React.createElement("h1", { key: "title", className: "title" }, "Component Test"),
                React.createElement("ul", { key: "list", className: "list" }, [
                    React.createElement(ListItem, { key: "item1", text: "Item 1" }),
                    React.createElement(ListItem, { key: "item2", text: "Item 2" }),
                    React.createElement(ListItem, { key: "item3", text: "Item 3" }),
                ]),
            ]);
        };

        // Create a container for our component
        const container = document.createElement("div");
        document.body.appendChild(container);

        // Render the component
        const root = createRoot(container);
        root.render(React.createElement(TestComponent));

        // Wait for rendering to complete
        await new Promise((resolve) => setTimeout(resolve, 100));

        console.log("Container HTML:", container.innerHTML);

        // Check that the component rendered correctly
        expect(container.querySelector(".title").textContent).toBe("Component Test");
        expect(container.querySelectorAll(".list-item").length).toBe(3);
        expect(container.querySelector(".list-item").textContent).toContain("Item 1");

        // Clean up
        root.unmount();
        document.body.removeChild(container);
    });
});
