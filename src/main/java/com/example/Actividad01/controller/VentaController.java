package com.example.Actividad01.controller;

import com.example.Actividad01.dto.VentaRequestDTO;
import com.example.Actividad01.dto.VentaResponseDTO;
import com.example.Actividad01.enums.EstadoVenta;
import com.example.Actividad01.service.service.VentaService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/ventas")
public class VentaController {
    private final VentaService ventaService;

    public VentaController(
            VentaService ventaService) {

        this.ventaService = ventaService;
    }

    @PostMapping
    public ResponseEntity<VentaResponseDTO> registrar(
            @Valid
            @RequestBody VentaRequestDTO request) {

        VentaResponseDTO response =
                ventaService.registrar(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VentaResponseDTO> buscar(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                ventaService.buscar(id)
        );
    }

    @GetMapping
    public ResponseEntity<List<VentaResponseDTO>> listar() {

        return ResponseEntity.ok(
                ventaService.listar()
        );
    }
    @PatchMapping("/{id}/anular")
    public ResponseEntity<VentaResponseDTO> anular(@PathVariable Long id) {
        return ResponseEntity.ok(ventaService.anular(id));
    }
    @GetMapping("/buscar")
    public ResponseEntity<List<VentaResponseDTO>> buscarVentas(
            @RequestParam(required = false) Long clienteId,
            @RequestParam(required = false) EstadoVenta estado,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta,
            @RequestParam(required = false, defaultValue = "fecha") String ordenarPor,
            @RequestParam(required = false, defaultValue = "DESC") String direccion) {

        return ResponseEntity.ok(ventaService.buscarVentas(clienteId, estado, desde, hasta, ordenarPor, direccion));
    }
}
