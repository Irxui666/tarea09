package com.example.Actividad01.service.service;

import com.example.Actividad01.dto.ClienteRequestDTO;
import com.example.Actividad01.dto.ClienteResponseDTO;
import com.example.Actividad01.service.generic.CrudService;

public interface ClienteService extends CrudService<ClienteRequestDTO, ClienteResponseDTO, Long> {
}
