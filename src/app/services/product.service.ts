import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  setDoc,
  deleteDoc
} from '@angular/fire/firestore';

import { Produto } from '../models/products.models';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private firestore = inject(Firestore);
  private productsCollection = collection(this.firestore, 'productsGlobal');

  /** 
   * LISTAR TODOS OS PRODUTOS (Snapshot Único)
   */
  getProducts(): Observable<Produto[]> {
    return collectionData(this.productsCollection, { idField: 'id' }).pipe(
      take(1),
      map(products => products as Produto[])
    );
  }

  /** 
   * OBTER UM PRODUTO PELO ID (Snapshot Único)
   */
  getProductById(id: string): Observable<Produto | null> {
    const productDocRef = doc(this.firestore, `productsGlobal/${id}`);
    return docData(productDocRef, { idField: 'id' }).pipe(
      take(1),
      map(product => (product ? (product as Produto) : null))
    );
  }

  /** CRIAR PRODUTO */
  async createProduct(product: Produto): Promise<void> {
    const { id, ...data } = product;
    
    const sanitizedName = product.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9_-]/g, '_')
      .replace(/_{2,}/g, '_')
      .replace(/^_+|_+$/g, '');
    
    if (!sanitizedName) {
      throw new Error('O nome do produto é inválido para gerar o ID');
    }
    
    const productDocRef = doc(this.productsCollection, sanitizedName);
    await setDoc(productDocRef, data);
  }

  /** DELETAR PRODUTO */
  async deleteProduct(id: string): Promise<void> {
    const productDoc = doc(this.firestore, `productsGlobal/${id}`);
    return deleteDoc(productDoc);
  }
}