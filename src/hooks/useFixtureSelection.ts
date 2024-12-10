import { useState, useCallback } from 'react';
import { Fixture } from '../types/fixtures';
import { useFixtureStore } from '../store/fixtureStore';

export function useFixtureSelection() {
  const [selectedFixtures, setSelectedFixtures] = useState<Set<string>>(new Set());
  const { fixtures } = useFixtureStore();

  const toggleSelection = useCallback((fixtureId: string) => {
    setSelectedFixtures(prev => {
      const next = new Set(prev);
      if (next.has(fixtureId)) {
        next.delete(fixtureId);
      } else {
        next.add(fixtureId);
      }
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedFixtures(new Set(fixtures.map(f => f.id)));
  }, [fixtures]);

  const clearSelection = useCallback(() => {
    setSelectedFixtures(new Set());
  }, []);

  const getSelectedFixtures = useCallback((): Fixture[] => {
    return fixtures.filter(f => selectedFixtures.has(f.id));
  }, [fixtures, selectedFixtures]);

  return {
    selectedFixtures,
    toggleSelection,
    selectAll,
    clearSelection,
    getSelectedFixtures,
    hasSelection: selectedFixtures.size > 0
  };
}