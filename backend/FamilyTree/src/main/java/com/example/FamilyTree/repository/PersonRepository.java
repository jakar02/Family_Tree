package com.example.FamilyTree.repository;

import com.example.FamilyTree.model.Person;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PersonRepository extends Neo4jRepository<Person, UUID> {


}
