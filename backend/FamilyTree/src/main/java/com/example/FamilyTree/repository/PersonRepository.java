package com.example.FamilyTree.repository;

import com.example.FamilyTree.model.Person;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PersonRepository extends Neo4jRepository<Person, UUID> {


    @Query("""
    MATCH (p:Person)
    WHERE NOT ()-[:HAS_CHILD]->(p)
        WITH root, collect(DISTINCT child) AS children, head(collect(DISTINCT partner)) AS partner
    RETURN root, children, partner
    RETURN p
""")
    List<Person> findRootPersons();

}
