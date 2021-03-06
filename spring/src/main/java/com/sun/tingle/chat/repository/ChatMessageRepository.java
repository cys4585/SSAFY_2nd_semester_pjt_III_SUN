package com.sun.tingle.chat.repository;

import com.sun.tingle.chat.entity.ChatMessage;
import com.sun.tingle.chat.entity.ChatRoom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    Page<ChatMessage> findAllByChatRoom(ChatRoom chatRoom, Pageable pageable);
}
