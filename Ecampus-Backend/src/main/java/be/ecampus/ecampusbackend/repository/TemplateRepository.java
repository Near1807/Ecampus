package be.ecampus.ecampusbackend.repository;

import be.ecampus.ecampusbackend.model.Template;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TemplateRepository extends JpaRepository<Template, Integer> {
}