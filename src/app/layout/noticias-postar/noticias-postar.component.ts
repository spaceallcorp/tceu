import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Firestore, addDoc, collection, serverTimestamp } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { CommonModule, DatePipe, AsyncPipe, NgIf, NgFor, DecimalPipe,  } from '@angular/common';
import { EditorModule } from '@tinymce/tinymce-angular';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-noticias-postar',
  imports: [FormsModule,AsyncPipe, CommonModule, EditorModule,],
  templateUrl: './noticias-postar.component.html',
  styleUrl: './noticias-postar.component.css'
})
export class NoticiasPostarComponent {
  tinymceApiKey: string = environment.tinymce?.apiKey || '';

  // Data models
  editorContent: string = '';
  author: string = '';
  featuredImageUrl: string = '';
  noticiaUrl: string = '';
  newNoticia = {
    title: '',
    author: '',
  };

  isSubmitting = false;
  errorMessage = '';

  // TinyMCE config
  editorConfig = {
    height: 400,
    menubar: true,
    plugins: [
      'advlist', 'autolink', 'link', 'image', 'lists', 'charmap', 'preview', 'anchor', 'pagebreak',
      'searchreplace', 'wordcount', 'visualblocks', 'visualchars', 'code', 'fullscreen', 'insertdatetime',
      'media', 'table', 'emoticons', 'help'
    ],
    toolbar:
      'undo redo | formatselect | bold italic backcolor | ' +
      'alignleft aligncenter alignright alignjustify | ' +
      'bullist numlist outdent indent | removeformat | help'
  };

  private firestore = inject(Firestore);
  private router = inject(Router);

  async onSubmit() {
    this.errorMessage = '';

    if (!this.newNoticia.title.trim()) {
      this.errorMessage = 'O título é obrigatório.';
      return;
    }

    /*
    if (!this.editorContent.trim()) {
      this.errorMessage = 'O conteúdo é obrigatório.';
      return;
    } */

    this.isSubmitting = true;

    try {
      const postsCollection = collection(this.firestore, 'noticiasPt');
      await addDoc(postsCollection, {
        title: this.newNoticia.title,
        content: this.editorContent,
        author: this.newNoticia.author,
        imageUrl: this.featuredImageUrl || null,
        noticiaUrl: this.noticiaUrl || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Reset form
      this.newNoticia.title = '';
      this.editorContent = '';
      this.featuredImageUrl = '';
      this.router.navigate(['/']);

    } catch (error) {
      console.error('Erro ao salvar o artigo:', error);
      this.errorMessage = this.getFirestoreError(error);
    } finally {
      this.isSubmitting = false;
    }
  }

  private getFirestoreError(error: any): string {
    if (error.code === 'permission-denied') {
      return 'Você não tem permissão para criar artigos.';
    }
    return 'Falha ao salvar. Tente novamente.';
  }
}
