# Alternative Ways to Manage `viewMode` State

This document outlines different approaches to managing the `viewMode` (List vs Map) state in the Search Page, ranging from simple local state to global state management.

## 1. Lifting State Up (Current Implementation)
**Concept**: State is held in the parent (`SearchPage`) and passed down to the child (`HeaderSearchSwitch`) via props. The child triggers state changes using a function passed from the parent.

**Pros**:
- Simple and easy to understand.
- Ideal for direct parent-child relationships.

**Cons**:
- **Prop Drilling**: Can become messy if components are nested deeply.
- **Not Persistent**: State is reset to default on page refresh.

**Code Example**:
```tsx
// Parent (SearchPage.tsx)
const [viewMode, setViewMode] = useState("list");
<HeaderSearchSwitch setViewMode={setViewMode} viewMode={viewMode} />

// Child (HeaderSearchSwitch.tsx)
<button onClick={() => setViewMode("map")}>Map</button>
```

---

## 2. URL Search Params (Recommended for Search) 🏆
**Concept**: Store the state in the URL query string (e.g., `/search?view=map`). When the user clicks "Map", the URL updates. The page reads the state directly from the URL.

**Pros**:
- **Shareable URLs**: Users can share the link (e.g., to a friend), and they will see the same view (Map/List).
- **Persistent**: The view mode remains selected even after a page refresh.
- **Browser History**: Users can use the "Back" button to switch back to the previous view.

**Cons**:
- Requires interaction with the Next.js Router (`useRouter`, `useSearchParams`).

**Code Example**:
```tsx
// Parent (SearchPage.tsx)
import { useSearchParams } from 'next/navigation';

export default function SearchPage() {
  const searchParams = useSearchParams();
  // Read directly from URL. Default to 'list' if not found.
  const viewMode = searchParams.get('view') || 'list'; 

  return (
     <HeaderSearchSwitch currentView={viewMode} />
  );
}

// Child (HeaderSearchSwitch.tsx)
import { useRouter, useSearchParams } from 'next/navigation';

export default function HeaderSearchSwitch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const changeView = (mode: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('view', mode);
    router.push(`?${params.toString()}`); // Updates URL
  };

  return (
    <button onClick={() => changeView('map')}>Map</button>
  );
}
```

---

## 3. Context API
**Concept**: Create a "Context" provider that wraps a section of the app. Any component inside that provider can access the state directly, bypassing the need to pass props through intermediate levels.

**Pros**:
- **Solves Prop Drilling**: Components deep in the tree can access data directly.
- **Scoped Global**: Global within a specific subtree of the app.

**Cons**:
- **Complexity**: Requires creating Context and Providers.
- **Coupling**: Components become dependent on the Context, making them harder to reuse in isolation.

**Code Example**:
```tsx
// Context Provider
export const ViewModeContext = createContext();

export function ViewModeProvider({ children }) {
  const [viewMode, setViewMode] = useState("list");
  return (
    <ViewModeContext.Provider value={{ viewMode, setViewMode }}>
      {children}
    </ViewModeContext.Provider>
  );
}

// Any Child Component
function MapButton() {
  const { setViewMode } = useContext(ViewModeContext);
  return <button onClick={() => setViewMode("map")}>Map</button>;
}
```

---

## 4. Global State (e.g., Zustand, Redux)
**Concept**: Store state in a central store that lives outside the React component tree.

**Pros**:
- **Truly Global**: State is accessible from anywhere in the application (even outside the Search feature).
- **Performance**: Can be optimized to prevent unnecessary re-renders.

**Cons**:
- **Overkill**: Often unnecessary for simple UI states like tabs or view modes.
- **Dependencies**: Adds external libraries to the project.

**Code Example (Zustand)**:
```tsx
import { create } from 'zustand'

const useSearchStore = create((set) => ({
  viewMode: 'list',
  setViewMode: (mode) => set({ viewMode: mode }),
}))

function HeaderSearchSwitch() {
  const setViewMode = useSearchStore((state) => state.setViewMode)
  return <button onClick={() => setViewMode("map")}>Map</button>;
}
```
