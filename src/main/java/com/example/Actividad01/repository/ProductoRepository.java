package com.example.Actividad01.repository;

import com.example.Actividad01.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    boolean existsByNombreIgnoreCase(String nombre);

    boolean existsByNombreIgnoreCaseAndIdNot(String nombre, Long id);
    List<Producto> findByCategoriaId(Long CategoriaId);

    boolean existsByCategoriaId(Long categoriaId);
}
