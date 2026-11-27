import { useEffect, useState } from 'react'
import sample from '../../data/muestra.json'
import { parseRecords } from '../services/records'
import type { TaxRecord } from '../types/dashboard'

interface RecordsState {
  records: TaxRecord[]
  loading: boolean
  error: string | null
  source: 'local' | 'firebase'
}

export function useTaxRecords(): RecordsState {
  const source = import.meta.env.VITE_DATA_SOURCE === 'firebase' ? 'firebase' : 'local'
  const [state, setState] = useState<Omit<RecordsState, 'source'>>({
    records: [], loading: true, error: null,
  })

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const records = source === 'firebase'
          ? await import('../services/firebase').then(({ loadFirebaseRecords }) => loadFirebaseRecords())
          : parseRecords(sample)
        if (active) setState({ records, loading: false, error: null })
      } catch (error) {
        if (active) setState({
          records: [], loading: false,
          error: error instanceof Error ? error.message : 'No se pudieron cargar los datos.',
        })
      }
    }
    void load()
    return () => { active = false }
  }, [source])

  return { ...state, source }
}
