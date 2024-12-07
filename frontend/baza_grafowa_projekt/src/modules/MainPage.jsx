import "/src/styles/MainPage.css";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  Button,
  TextField,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add"; // Import ikony plusa

function MainPage() {
  const [familyTrees, setFamilyTrees] = useState([]);
  const [selectedTree, setSelectedTree] = useState(null);
  const [editingTree, setEditingTree] = useState(null); // Stan dla nowego drzewa

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [founderAdded, setFounderAdded] = useState(false);
  const [ifSaveFamily, setIfSaveFamily] = useState(false);
  // Funkcja do obsługi kliknięcia drzewa
  const handleTreeSelect = (tree) => {
    setSelectedTree(tree);
    setEditingTree(null); // Wyłącz edycję nowego drzewa
  };

  const handleAddFamilyTree = () => {
    const newTree = {
      treeName: "New Family Tree",
      firstName: "",
      lastName: "",
      partners: [],
      children: [],
    };
    setEditingTree(newTree);
  };

  // Funkcja do dodania nowego członka do drzewa
  const handleAddPartner = (parent) => {
    if (firstName.trim()) {
      //const updatedTree = { ...editingTree };
      
      if(parent.partners.length > 0){
        parent.partners[0] = {
          firstName: firstName,
          lastName: lastName,
          partners: [],
          children: [],
        };
      }
      else{
        parent.partners.push({
          firstName: firstName,
          lastName: lastName,
          partners: [],
          children: [],
        });
      }


      const updatedTree = { ...editingTree };
      console.log("Dodano partnera:", parent);

      setEditingTree(updatedTree);
      setFirstName(""); // Reset pola
      setLastName(""); // Reset pola
      
    }
  };

  const handleAddFounder = () => {
    setFounderAdded(true);
  };

  const handleAddChild = (parent) => {
    if (firstName.trim()) {
      const updatedTree = { ...editingTree };
      parent.children.push({
        firstName: firstName,
        lastName: lastName,
        partners: [],
        children: [],
      });
      setEditingTree(updatedTree);
      setFirstName(""); // Reset pola
      setLastName(""); // Reset pola
    }
  };

  // Funkcja do zapisywania drzewa genealogicznego
  const handleSaveFamilyTree = async () => {
    
    setFounderAdded(false);
    console.log("Zapisywanie drzewa genealogicznego:", editingTree);
    if (!editingTree.firstName || !editingTree.lastName) {
      alert("Podaj imię i nazwisko założyciela drzewa!");
      return;
    }

    try {
      // Wykonanie żądania POST do API, aby zapisać drzewo genealogiczne
      const response = await axios.post(
        "http://localhost:8080/api/persons/add-family-tree",
        {
          treeName: editingTree.treeName,
          name: editingTree.firstName,
          surname: editingTree.lastName,
          partners: editingTree.partners,
          children: editingTree.children,
        }
      );

      // Jeśli odpowiedź jest pozytywna, dodajemy drzewo do lokalnego stanu
      if (response.status === 200) {
        setFamilyTrees([...familyTrees, response.data]); // Zakładając, że odpowiedź zawiera zapisane drzewo
        alert("Drzewo genealogiczne zostało zapisane!");
      } else {
        alert("Błąd podczas zapisywania drzewa genealogicznego.");
      }

      // Resetujemy stan edytowanego drzewa po zapisaniu
      setEditingTree(null);
      setIfSaveFamily(!ifSaveFamily);
    } catch (error) {
      console.error("Błąd zapisywania drzewa:", error);
      alert("Wystąpił błąd podczas zapisywania drzewa. Spróbuj ponownie.");
    }
  };

  const getAllTrees = async () => {
    setFounderAdded(false);
    try {
      const response = await axios.get(
        "http://localhost:8080/api/persons/root-persons"
      );
      console.log("Poprawnie pobrano drzewa genealogiczne:", response.data);
      setFamilyTrees(response.data);
    } catch (error) {
      console.error("Błąd pobierania drzewa genealogicznego:", error);
    }
  };

  useEffect(() => {
    getAllTrees();
  }, [ifSaveFamily]);

  const renderFamilyTree = (person, level = 0) => (
    <Box
      key={person.id}
      marginLeft={`${level * 30}px`}
      padding="10px"
      borderLeft="2px solid #ccc"
    >
      {/* Wyświetlanie osoby i jej partnera */}
      <Typography variant="body1">
        {person.firstName} {person.lastName}
        {console.log("person partners: ", person.partners)}
        {person.partners.length > 0
          ? " and " + person.partners[0].firstName + " " + person.partners[0].lastName
          : ""}
      </Typography>

      {/* Wyświetlanie dzieci */}
      {person.children.length > 0 && (
        <Box marginLeft="10px">
          {person.children.map((child) => renderFamilyTree(child, level + 1))}
        </Box>
      )}

      {/* Dodawanie partnera i dziecka dla każdego poziomu */}
      {editingTree && (
        <Box marginTop="10px">
          <TextField
            size="small"
            sx={{ width: 130 }}
            label="Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            style={{ marginRight: "10px" }}
          />
          <TextField
            size="small"
            sx={{ width: 130 }}
            label="Surname"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            style={{ marginRight: "10px" }}
          />
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            color="primary"
            onClick={() => handleAddPartner(person)}
            style={{ marginRight: "10px" }}
          >
            Add as a Partner
          </Button>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            color="primary"
            onClick={() => handleAddChild(person)}
          >
            Add as a Child
          </Button>
        </Box>
      )}
    </Box>
  );

  return (
    <div className="MainPage" style={{ display: "flex" }}>
      {/* Drawer na stałe otwarty */}
      <Drawer
        variant="permanent"
        anchor="left"
        style={{ zIndex: 1 }}
        PaperProps={{ style: { width: 220, padding: "10px" } }}
      >
        <div style={{ padding: "10px" }}>
          {/* Pełny przycisk "+ Add Family Tree" */}
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            style={{ marginBottom: "10px", width: "100%" }}
            onClick={() => {
              setSelectedTree(null);
              handleAddFamilyTree();
            }}
          >
            Add Family Tree
          </Button>

          {/* Lista drzew genealogicznych */}
          <List>
            {familyTrees.map((tree) => (
              <ListItem
                button
                key={tree.id}
                onClick={() => handleTreeSelect(tree)}
              >
                <ListItemText primary={tree.treeName} />
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>

      <div style={{ flex: 1, marginLeft: "250px", padding: "20px" }}>
        {/* Wyświetlanie drzewa genealogicznego */}
        {selectedTree && !editingTree && (
          <div>
            <h2>{selectedTree.treeName}</h2>
            {/* Jeśli kliknięto już istniejące drzewo, wyświetlamy jego strukturę */}
            {renderFamilyTree(selectedTree)}
            {console.log("wybrano drzewo", selectedTree)}
          </div>
        )}

        {/* Edycja nowego drzewa genealogicznego */}
        {editingTree && (
          <div>
            {/* Pola założyciela drzewa */}
            <Box marginBottom="20px">
              <TextField
                size="small"
                sx={{ width: 190 }}
                label="Tree Name"
                value={editingTree.treeName}
                onChange={(e) =>
                  setEditingTree({
                    ...editingTree,
                    treeName: e.target.value,
                  })
                }
                style={{ marginRight: "10px" }}
              />

              <h2>{editingTree.treeName}</h2>

              {!founderAdded ? (
                <div>
                  <TextField
                    size="small"
                    sx={{ width: 130 }}
                    label="Founder first Name"
                    value={editingTree.firstName}
                    onChange={(e) =>
                      setEditingTree({
                        ...editingTree,
                        firstName: e.target.value,
                      })
                    }
                    style={{ marginRight: "10px" }}
                  />
                  <TextField
                    size="small"
                    sx={{ width: 130 }}
                    label="Founder last Name"
                    value={editingTree.lastName}
                    onChange={(e) =>
                      setEditingTree({
                        ...editingTree,
                        lastName: e.target.value,
                      })
                    }
                    style={{ marginRight: "10px" }}
                  />

                  <Button
                    startIcon={<AddIcon />}
                    variant="contained"
                    color="primary"
                    onClick={() => handleAddFounder()}
                  >
                    Add Founder
                  </Button>
                </div>
              ) : (
                renderFamilyTree(editingTree, 0)
              )}
            </Box>

            {/* Renderowanie drzewa */}
            {}

            {/* Zapis drzewa */}
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSaveFamilyTree}
              style={{ marginTop: "20px" }}
            >
              Save Family Tree
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainPage;
