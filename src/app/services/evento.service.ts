

  import { Injectable, inject, signal } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, deleteDoc } from '@angular/fire/firestore';
import { Evento } from '../models/evento.models';
import { EventoDestaque } from '../models/evento.models';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  private firestore = inject(Firestore);
  private eventosCollection = collection(this.firestore, 'eventosDestaqueEU');
  
  eventos = signal<Evento[]>([]);

  constructor() {
    console.log('EventosService initializado');
    this.getEventos().subscribe(eventos => {
      console.log('Eventos carregados', eventos);
      this.eventos.set(eventos);
    });
  }

  getEventos(): Observable<Evento[]> {
    console.log('Fetching all eventos');
    return collectionData(this.eventosCollection, { idField: 'id' }).pipe(
      map((eventos: any[]) => eventos.map(evento => evento as Evento)),
      tap(eventos => console.log('Eventos from Firestore:', eventos))
    ) as Observable<Evento[]>;
  } 


  getEventosDestaque(): Observable<EventoDestaque[]> {
  console.log('Fetching featured eventos');

  const eventosDestaqueCollection = collection(
    this.firestore,
    'eventosDestaqueEU' // Certifique-se de que este nome corresponde ao nome da coleção no Firestore
  );

  return collectionData(eventosDestaqueCollection, { idField: 'id' }).pipe(
    map((eventos: any[]) => eventos.map(evento => evento as EventoDestaque)),
    tap(eventos => console.log('Featured eventos from Firestore:', eventos))
  ) as Observable<Evento[]>;
}

  getEventoById(id: string): Observable<Evento | undefined> {
    console.log('Fetching evento with ID:', id);
    const postDoc = doc(this.firestore, `eventosPt/${id}`); // corrigido "vagas" → "eventosNg"
    return docData(postDoc, { idField: 'id' }).pipe(
      map(evento => {
        if (!evento) {
          throw new Error('Evento não encontrado');
        }
        return evento as Evento;
      }),
      tap(evento => console.log('Retrieved evento:', evento))
    ) as Observable<Evento>;
  }

  /** NOVO MÉTODO → Deletar evento por ID */
  async deleteEvento(id: string): Promise<void> {
    console.log('Deletando evento com ID:', id);
    const eventoDoc = doc(this.firestore, `eventosPt/${id}`);
    return deleteDoc(eventoDoc);
  }

  
}