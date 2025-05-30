
package com.mycompany.renovai;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.stream.Collectors;
import org.json.JSONArray;
import org.json.JSONObject;

public class ChatBot {

    private static final String apiKey = System.getenv("OPENAI_API_KEY");

    private static final String API_URL = "https://api.openai.com/v1/chat/completions";

    public String conversa(String mensagem, listaMensagens listaMensagem) throws Exception {

        JSONArray messagesArray = new JSONArray();

        // Mensagem de sistema (instrução)
        messagesArray.put(new JSONObject()
            .put("role", "system")
            .put("content", "Você é um especialista em sustentabilidade, meio ambiente e fontes de energias renováveis. Responda apenas perguntas nesse cunho."));

        // Adiciona histórico
        List<String> historico = listaMensagem.paraChatMessagesAsText();
        for (String m : historico) {
            messagesArray.put(new JSONObject()
                .put("role", "user")
                .put("content", m));
        }

        // Adiciona a pergunta atual
        messagesArray.put(new JSONObject()
            .put("role", "user")
            .put("content", mensagem));

        JSONObject requestBody = new JSONObject()
            .put("model", "gpt-4o")
            .put("temperature", 0.0)
            .put("messages", messagesArray);

       HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create(API_URL))
    .header("Authorization", "Bearer " + apiKey)  // ← aqui corrigido
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString(requestBody.toString()))
    .build();


        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() == 200) {
            JSONObject json = new JSONObject(response.body());
            return json.getJSONArray("choices")
                       .getJSONObject(0)
                       .getJSONObject("message")
                       .getString("content");
        } else {
            return "Erro ao se conectar com a OpenAI: " + response.body();
        }
    }
}
