import { create } from 'zustand';
import { Fixture, FixtureGroup } from '../types/fixtures';

interface FixtureStore {
  fixtures: Fixture[];
  groups: FixtureGroup[];
  activeGroup: string | null;
  addFixture: (fixture: Fixture) => void;
  updateFixture: (id: string, updates: Partial<Fixture>) => void;
  removeFixture: (id: string) => void;
  addGroup: (group: FixtureGroup) => void;
  updateGroup: (id: string, updates: Partial<FixtureGroup>) => void;
  removeGroup: (id: string) => void;
  setActiveGroup: (id: string | null) => void;
}

export const useFixtureStore = create<FixtureStore>((set) => ({
  fixtures: [],
  groups: [
    { id: 'all', name: 'All Fixtures', fixtures: [] },
    { id: 'stage', name: 'Stage', fixtures: [] },
    { id: 'front', name: 'Front Lights', fixtures: [] },
    { id: 'back', name: 'Back Lights', fixtures: [] }
  ],
  activeGroup: 'all',

  addFixture: (fixture) =>
    set((state) => ({
      fixtures: [...state.fixtures, fixture],
      groups: state.groups.map(group =>
        group.id === 'all'
          ? { ...group, fixtures: [...group.fixtures, fixture.id] }
          : group
      )
    })),

  updateFixture: (id, updates) =>
    set((state) => ({
      fixtures: state.fixtures.map(fixture =>
        fixture.id === id ? { ...fixture, ...updates } : fixture
      )
    })),

  removeFixture: (id) =>
    set((state) => ({
      fixtures: state.fixtures.filter(fixture => fixture.id !== id),
      groups: state.groups.map(group => ({
        ...group,
        fixtures: group.fixtures.filter(fixtureId => fixtureId !== id)
      }))
    })),

  addGroup: (group) =>
    set((state) => ({
      groups: [...state.groups, group]
    })),

  updateGroup: (id, updates) =>
    set((state) => ({
      groups: state.groups.map(group =>
        group.id === id ? { ...group, ...updates } : group
      )
    })),

  removeGroup: (id) =>
    set((state) => ({
      groups: state.groups.filter(group => group.id !== id)
    })),

  setActiveGroup: (id) =>
    set(() => ({
      activeGroup: id
    }))
}));