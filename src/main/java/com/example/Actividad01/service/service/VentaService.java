package com.example.Actividad01.service.service;

import com.example.Actividad01.dto.VentaRequestDTO;
import com.example.Actividad01.dto.VentaResponseDTO;
import com.example.Actividad01.enums.EstadoVenta;

import java.time.LocalDate;
import java.util.List;

public interface VentaService {
    VentaResponseDTO registrar(VentaRequestDTO request);
    VentaResponseDTO buscar(Long id);
    List<VentaResponseDTO> listar();
    VentaResponseDTO anular(Long id);
    List<VentaResponseDTO> buscarVentas(
            Long clienteId,
            EstadoVenta estado,
            LocalDate desde,
            LocalDate hasta,
            String ordenarPor,
            String direccion
    );
}
