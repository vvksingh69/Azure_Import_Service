resource "azurerm_storage_container" "uploaded" {
  name                  = "uploaded"
  storage_account_name  = azurerm_storage_account.storage.name
  container_access_type = "private"
}