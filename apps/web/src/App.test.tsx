import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { useChordStore } from "./store/useChordStore";

const audioSpies = vi.hoisted(() => ({
  playChord: vi.fn(),
  playProgression: vi.fn(),
  stopProgression: vi.fn()
}));

vi.mock("./audio/chordEngine", () => ({
  chordEngine: {
    playChord: audioSpies.playChord,
    playProgression: audioSpies.playProgression,
    stopProgression: audioSpies.stopProgression
  }
}));

describe("Chromatic Canvas app", () => {
  beforeEach(() => {
    window.localStorage.clear();
    useChordStore.getState().resetStore();
    audioSpies.playChord.mockReset();
    audioSpies.playProgression.mockReset();
    audioSpies.stopProgression.mockReset();
  });

  it("keeps the note pad and keyboard in sync", () => {
    render(<App />);

    fireEvent.click(screen.getByTestId("note-pad-C"));

    expect(screen.getByTestId("keyboard-key-C3")).toHaveAttribute("aria-pressed", "true");
  });

  it("updates resolved voicing when inversion changes", () => {
    render(<App />);

    fireEvent.click(screen.getByTestId("note-pad-C"));
    fireEvent.click(screen.getByTestId("note-pad-E"));
    fireEvent.click(screen.getByTestId("note-pad-G"));

    const notesBefore = within(screen.getByTestId("resolved-midi-notes")).getByText("C4");
    expect(notesBefore).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Inv 1" }));

    expect(within(screen.getByTestId("resolved-midi-notes")).getByText("C5")).toBeInTheDocument();
  });

  it("switches the active instrument preset", () => {
    render(<App />);

    fireEvent.click(screen.getAllByRole("button", { name: /Warm Pad/i })[0]);

    expect(screen.getAllByText("Warm Pad").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: /Warm Pad/i })[0]).toHaveAttribute("aria-pressed", "true");
  });

  it("saves a chord and reuses it in the progression builder", () => {
    render(<App />);

    fireEvent.click(screen.getByTestId("note-pad-C"));
    fireEvent.click(screen.getByTestId("note-pad-E"));
    fireEvent.click(screen.getByTestId("note-pad-G"));
    fireEvent.click(screen.getByRole("button", { name: /Save chord/i }));

    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(screen.getByText("Arrangement lane")).toBeInTheDocument();
    expect(screen.getAllByTestId(/progression-step-/)).toHaveLength(1);
  });

  it("reorders progression steps without losing beat lengths or tempo", () => {
    render(<App />);

    fireEvent.click(screen.getByTestId("note-pad-C"));
    fireEvent.click(screen.getByTestId("note-pad-E"));
    fireEvent.click(screen.getByTestId("note-pad-G"));
    fireEvent.click(screen.getByRole("button", { name: /Save chord/i }));

    fireEvent.click(screen.getByRole("button", { name: /Clear notes/i }));
    fireEvent.click(screen.getByTestId("note-pad-D"));
    fireEvent.click(screen.getByTestId("note-pad-F"));
    fireEvent.click(screen.getByTestId("note-pad-A"));
    fireEvent.click(screen.getByRole("button", { name: /Save chord/i }));

    const addButtons = screen.getAllByRole("button", { name: "Add" });
    fireEvent.click(addButtons[1]);
    fireEvent.click(addButtons[0]);

    fireEvent.change(screen.getByLabelText("Tempo"), { target: { value: "110" } });

    const firstStep = screen.getAllByTestId(/progression-step-/)[0];
    const secondStep = screen.getAllByTestId(/progression-step-/)[1];
    const secondBeatsInput = within(secondStep).getByDisplayValue("4");
    fireEvent.change(secondBeatsInput, { target: { value: "6" } });

    const dataTransfer = {
      data: new Map<string, string>(),
      setData(type: string, value: string) {
        this.data.set(type, value);
      },
      getData(type: string) {
        return this.data.get(type) ?? "";
      }
    };

    fireEvent.dragStart(firstStep, { dataTransfer });
    fireEvent.dragOver(secondStep, { dataTransfer });
    fireEvent.drop(secondStep, { dataTransfer });

    const reorderedFirstStep = screen.getAllByTestId(/progression-step-/)[0];
    expect(within(reorderedFirstStep).getByText("Dm")).toBeInTheDocument();
    expect(within(reorderedFirstStep).getByDisplayValue("6")).toBeInTheDocument();
    expect(screen.getByLabelText("Tempo")).toHaveValue(110);
  });
});
