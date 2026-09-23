import { Injectable, inject, signal } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, deleteDoc } from '@angular/fire/firestore';
import { Evento, EventoDestaque } from '../models/evento.models';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';

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
      tap(eventos => console.log('Eventos from Firestore:', eventos)),
      catchError(error => {
        console.error('Erro ao buscar eventos (rede/Firestore):', error);
        return of([]); // Retorna array vazio sem quebrar a aplicação ou a subscription
      })
    );
  } 

  getEventosDestaque(): Observable<EventoDestaque[]> {
    console.log('Fetching featured eventos');

    const eventosDestaqueCollection = collection(
      this.firestore,
      'eventosDestaqueEU'
    );

    return collectionData(eventosDestaqueCollection, { idField: 'id' }).pipe(
      map((eventos: any[]) => eventos.map(evento => evento as EventoDestaque)),
      tap(eventos => console.log('Featured eventos from Firestore:', eventos)),
      catchError(error => {
        console.error('Erro ao buscar eventos em destaque (rede/Firestore):', error);
        return of([]); // Retorna array vazio em caso de falha na conexão
      })
    );
  }

  getEventoById(id: string): Observable<Evento | undefined> {
    console.log('Fetching evento with ID:', id);
    const postDoc = doc(this.firestore, `eventosPt/${id}`);

    return docData(postDoc, { idField: 'id' }).pipe(
      map(evento => {
        if (!evento) {
          throw new Error('Evento não encontrado');
        }
        return evento as Evento;
      }),
      tap(evento => console.log('Retrieved evento:', evento)),
      catchError(error => {
        console.error(`Erro ao buscar evento com ID [${id}]:`, error);
        return of(undefined); // Retorna undefined de forma segura para o componente tratar
      })
    );
  }

  /** Deletar evento por ID */
  async deleteEvento(id: string): Promise<void> {
    console.log('Deletando evento com ID:', id);
    try {
      const eventoDoc = doc(this.firestore, `eventosPt/${id}`);
      await deleteDoc(eventoDoc);
    } catch (error) {
      console.error(`Erro ao deletar evento com ID [${id}]:`, error);
      throw error;
    }
  }
}