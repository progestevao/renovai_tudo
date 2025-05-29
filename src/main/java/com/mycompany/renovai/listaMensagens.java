
package com.mycompany.renovai;

import java.util.ArrayList;
import java.util.List;

public class listaMensagens {

    No inicio;

    void inserir(String mensagem) {
        No novo = new No(mensagem);
        if (inicio == null) {
            inicio = novo;
        } else {
            No atual = inicio;
            while (atual.proximo != null) {
                atual = atual.proximo;
            }
            atual.proximo = novo;
        }
    }

    public List<String> paraChatMessagesAsText() {
        List<String> mensagens = new ArrayList<>();
        No atual = inicio;
        while (atual != null) {
            mensagens.add(atual.mensagem);
            atual = atual.proximo;
        }
        return mensagens;
    }
}
