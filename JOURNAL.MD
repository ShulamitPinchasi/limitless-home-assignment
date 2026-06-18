# JOURNAL

## Goal

The purpose of this assignment was not to build a feature-rich Kanban board, but to compare different client-side state management approaches under the same conditions.

All implementations share:

* The same UI
* The same backend
* The same WebSocket protocol
* The same optimistic update strategy

Only the client-side state layer changes.

---

# Approach 1 – React Local State (useState)

## Description

In this implementation, board state is stored using React's built-in `useState`.

The state is owned by a top-level provider component and passed down through a shared API.

## What I liked

* Very little boilerplate.
* Easy to understand.
* No external dependencies.
* Great for small applications and prototypes.

## Challenges

As the application grows, state often needs to be passed through multiple component levels (prop drilling), making the code harder to maintain.

Because state is owned by a parent component, updates can trigger unnecessary re-renders in descendant components that do not directly depend on the changed data.

Real-time updates arriving from WebSocket events also require additional coordination, since there is no centralized store managing shared state.

While still manageable for this assignment, I believe this approach becomes harder to maintain as application complexity increases.

## Summary

For small projects this is probably the simplest solution.

For larger collaborative applications I would not choose it.

## When I would choose it

* Small applications
* Limited shared state
* Short-lived projects
* Teams that prefer minimal abstractions

## When I would avoid it

* Large component trees
* Frequently changing shared state
* Realtime collaborative applications

---

# Approach 2 – React Context + useReducer

## Description

In this implementation, board state is managed through React Context and a reducer.

State transitions are represented as explicit actions.

## What I liked

* Built entirely with React primitives.
* Predictable update flow.
* Reducers make state transitions easy to reason about.
* Scales better than pure local state.

## Challenges

The amount of boilerplate increased significantly.

Adding new state operations required:

* Action definitions
* Reducer updates
* Dispatch logic

One challenge with Context is that updates to the provider value can cause all consumers to re-render.

This can be mitigated with context splitting, memoization, or selector-based patterns, but it adds additional complexity.

## Summary

This approach provides structure and predictability, but requires more code and maintenance.

It is a reasonable choice for medium-sized applications where introducing a third-party library is undesirable.

## When I would choose it

* Medium-sized applications with shared state.
* Teams that prefer staying within React's built-in ecosystem.
* Applications that benefit from explicit state transitions.
* Cases where introducing an external state library is not desirable.

## When I would avoid it

* Applications with many independent state updates.
* Large-scale applications where Context providers become difficult to manage.
* Scenarios where minimizing re-renders is a primary concern.
* Projects where the additional reducer and action boilerplate outweighs the benefits.

---

# Approach 3 – Zustand

## Description

In this implementation, board state is stored in a centralized Zustand store.

Components subscribe only to the state slices they need. This helped reduce unnecessary re-renders compared to Context-based state sharing.

## What I liked

* Very small amount of code.
* Minimal boilerplate.
* Easy WebSocket integration.
* State updates are straightforward and easy to read.
* Excellent developer experience.

## Challenges

The main trade-off is introducing an external dependency.

For teams that strongly prefer React-native solutions, this may be considered a downside.

## Summary

For this assignment, Zustand felt like the most natural solution.

It provided global state management without the complexity of reducers and action definitions.

## When I would choose it

* Realtime applications with frequent state updates.
* Applications with shared state across many components.
* Projects that require a centralized store with minimal boilerplate.
* Teams that value simplicity and fast development.

## When I would avoid it

* Very small applications where local state is sufficient.
* Teams that prefer avoiding external dependencies.
* Projects where introducing another library is considered unnecessary overhead.

---

# Comparison

| Area           | Local  | Context     | Zustand   |
| -------------- | ------ | ----------- | --------- |
| Boilerplate    | Low    | High        | Low       |
| Re-renders     | High   | Medium/High | Low       |
| Scalability    | Low    | Medium      | High      |
| Dev Experience | Good   | Medium      | Excellent |
| WebSocket Fit  | Medium | Good        | Excellent |
| Learning Curve | Low    | Medium      | Low       |

---

# Final Recommendation

For this assignment, Zustand was my preferred solution.

The application maintains shared board state, receives frequent WebSocket updates, and requires multiple unrelated components to react to state changes.

Compared to Local State, Zustand avoids prop drilling and centralizes state management.

Compared to Context + Reducer, it requires significantly less boilerplate while still providing a predictable update model.

For these reasons, Zustand offered the best balance between simplicity, maintainability, and scalability for a realtime collaborative application.
